const pool = require('./db');

const seed = async () => {
  try {
    const prj = await pool.query("INSERT INTO prj (id, nm, st) VALUES (1, 'Metro Line 3', 'Active') ON CONFLICT (id) DO NOTHING RETURNING id");
    
    // L1: Master Project Node
    const l1 = await pool.query("INSERT INTO wbs (pid, prnt_id, lvl, cd, nm) VALUES (1, NULL, 1, 'L3-00', 'Metro Line 3 Build') RETURNING id");
    const l1_id = l1.rows[0].id;

    // L2: Major Phase
    const l2 = await pool.query("INSERT INTO wbs (pid, prnt_id, lvl, cd, nm) VALUES (1, $1, 2, 'STR-01', 'Structural Works') RETURNING id", [l1_id]);
    const l2_id = l2.rows[0].id;

    // L6: Executable Leaf Tasks (Linked to L2)
    const t1 = await pool.query("INSERT INTO wbs (pid, prnt_id, lvl, cd, nm) VALUES (1, $1, 6, 'EXC-01', 'Foundation Excavation') RETURNING id", [l2_id]);
    const t2 = await pool.query("INSERT INTO wbs (pid, prnt_id, lvl, cd, nm) VALUES (1, $1, 6, 'CON-02', 'Concrete Pouring') RETURNING id", [l2_id]);

    // Insert Baseline Quantities for the L6 tasks
    await pool.query("INSERT INTO act (wid, plan_qty, act_qty, unt) VALUES ($1, 100, 0, 'pct')", [t1.rows[0].id]);
    await pool.query("INSERT INTO act (wid, plan_qty, act_qty, unt) VALUES ($1, 100, 0, 'pct')", [t2.rows[0].id]);

    console.log('✅ Hierarchical WBS Data Injected!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    pool.end();
  }
};

seed();