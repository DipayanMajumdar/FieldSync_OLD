const exp = require('express');
const ax = require('axios');
const p = require('./db');
const multer = require('multer');
const path = require('path');
const rt = exp.Router();
const fs = require('fs');
const csv = require('csv-parser');

// Configure Multer for local storage
const stg = multer.diskStorage({
  destination: './uploads/',
  filename: (q, f, cb) => cb(null, Date.now() + path.extname(f.originalname))
});
const up = multer({ storage: stg });

rt.get('/prj/:id/wbs', async (q, rs) => {
  try {
    const d = await p.query('SELECT * FROM wbs WHERE pid = $1', [q.params.id]);
    rs.json(d.rows);
  } catch (e) {
    rs.status(500).json({ err: 1 });
  }
});

// Inside routes.js, update the /evd POST route
rt.post('/evd', up.single('file'), async (q, rs) => {
  const { id, w, t, lat, lng } = q.body; // Now expecting lat and lng from mobile
  const u = q.file ? path.resolve(q.file.path) : q.body.u;
  
  try {
    const ai = await ax.post('http://127.0.0.1:8000/analyze', { id: parseInt(id), uri: u, typ: t });
    
    // NEW: Insert spatial coordinates using PostGIS ST_MakePoint
    const ev = await p.query(
      'INSERT INTO evd (pid, geom, uri) VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4) RETURNING id', 
      [id, lng || 0, lat || 0, u]
    );
    
    rs.json({ db: ev.rows[0], ai: ai.data });
  } catch (e) {
    console.error("API ERR:", e.message);
    rs.status(500).json({ err: 1 });
  }
});

rt.post('/brg', async (q, rs) => {
  const { wid, pp } = q.body;
  try {
    const t = await p.query('SELECT * FROM act WHERE wid = $1', [wid]);
    if (!t.rows.length) return rs.status(404).json({ err: 'not found' });
    const b = t.rows[0].qty;
    const d = pp - b;
    const s = await p.query('INSERT INTO aud (uid, act, bfr, aft) VALUES ($1, $2, $3, $4) RETURNING id', ['sys', 'ai_sg', b, pp]);
    rs.json({ dev: d, sug: s.rows[0].id });
  } catch (e) {
    rs.status(500).json({ err: 1 });
  }
});

rt.post('/approve', async (q, rs) => {
  const { aid, wid, pp } = q.body; 
  try {
    // 1. Update the actual completed quantity (using the new act_qty column)
    await p.query('UPDATE act SET act_qty = $1 WHERE wid = $2', [pp, wid]);
    
    // 2. Insert an official audit log so it shows up on the dashboard
    await p.query("INSERT INTO aud (uid, act, bfr, aft) VALUES ($1, $2, $3, $4)", ['sys_manager', 'ai_apv', 0, pp]);
    
    rs.json({ st: 'Schedule successfully updated' });
  } catch (e) {
    console.error("APV ERR:", e.message);
    rs.status(500).json({ err: 1 });
  }
});

rt.post('/schedule/upload', up.single('file'), async (q, rs) => {
  const tasks = [];
  const pid = q.body.pid || 1; // Default to Project ID 1 if not provided

  // 1. Parse the uploaded CSV file
  fs.createReadStream(q.file.path)
    .pipe(csv())
    .on('data', (row) => tasks.push(row))
    .on('end', async () => {
      try {
        // 2. Loop through each row and inject it into PostgreSQL
        for (const t of tasks) {
          // Insert the WBS node
          const wbs = await p.query(
            'INSERT INTO wbs (pid, cd, nm) VALUES ($1, $2, $3) RETURNING id',
            [pid, t.wbs_code, t.wbs_name]
          );
          
          // Insert the Baseline Activity Quantity (default to 100%)
          await p.query(
            'INSERT INTO act (wid, qty, unt) VALUES ($1, $2, $3)',
            [wbs.rows[0].id, t.planned_qty || 100, 'pct']
          );
        }
        rs.json({ st: `Successfully imported ${tasks.length} WBS tasks into PostgreSQL.` });
      } catch (e) {
        console.error("INGESTION ERR:", e.message);
        rs.status(500).json({ err: 'Database insertion failed' });
      }
    });
});

rt.get('/dashboard/:pid', async (q, rs) => {
  const pid = q.params.pid;
  try {
    // 1. The Rollup Engine: Calculate L1 Master Progress from L6 Leaf Tasks
    const progRes = await p.query(`
      SELECT 
        COALESCE(SUM(a.act_qty), 0) as actual_total,
        COALESCE(SUM(a.plan_qty), 1) as plan_total
      FROM act a
      JOIN wbs w ON a.wid = w.id
      WHERE w.pid = $1 AND w.lvl = 6
    `, [pid]);
    
    const actual = parseFloat(progRes.rows[0].actual_total);
    const planned = parseFloat(progRes.rows[0].plan_total);
    const overall_pct = ((actual / planned) * 100).toFixed(2);

    // 2. Fetch Recent AI-Approved Delay Alerts
    const alerts = await p.query(`
      SELECT * FROM aud 
      WHERE act = 'ai_apv' 
      ORDER BY ts DESC LIMIT 5
    `);

    // 3. Fetch the hierarchical WBS tree for the Gantt Chart
    const tree = await p.query('SELECT * FROM wbs WHERE pid = $1 ORDER BY lvl, id', [pid]);

    rs.json({
      project_id: pid,
      overall_progress_pct: overall_pct,
      total_planned_qty: planned,
      total_actual_qty: actual,
      alerts: alerts.rows,
      wbs_tree: tree.rows
    });
  } catch (e) {
    console.error("DASHBOARD ERR:", e.message);
    rs.status(500).json({ err: 'Dashboard generation failed' });
  }
});

module.exports = rt;