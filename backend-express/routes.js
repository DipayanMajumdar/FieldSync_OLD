const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const db = require('./db');
const csv = require('csv-parser');
const router = express.Router();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'));
    }
});
const upload = multer({ storage });

// Recursive WBS upward rollup engine (L6 -> L1)
async function recalculateRollup(nodeId) {
    let currentId = nodeId;

    while (currentId) {
        const parentRes = await db.query('SELECT parent_id FROM wbs_nodes WHERE id = $1', [currentId]);
        const parentId = parentRes.rows[0]?.parent_id;

        if (!parentId) break;

        // Weighted aggregation: sum(child_progress * child_weight) / sum(child_weight)
        const rollupRes = await db.query(`
            SELECT 
                COALESCE(SUM(progress * weight) / NULLIF(SUM(weight), 0), 0) AS calculated_progress
            FROM wbs_nodes 
            WHERE parent_id = $1
        `, [parentId]);

        const newProg = parseFloat(rollupRes.rows[0].calculated_progress).toFixed(1);

        await db.query(`
            UPDATE wbs_nodes 
            SET progress = $1, 
                status = CASE WHEN $1 < planned_progress - 5 THEN 'BEHIND' ELSE 'ON_TRACK' END,
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2
        `, [newProg, parentId]);

        currentId = parentId;
    }
}

// 1. Sync Field Entry (Receives payload -> Calls AI Worker -> Updates DB -> Triggers Rollup)
router.post('/sync', upload.fields([{ name: 'image' }, { name: 'audio' }]), async (req, res) => {
    const { wbs_id, progress, quantity, unit, lat, lng } = req.body;
    const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
    const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;

    let aiTags = [];
    let transcript = "No voice remark provided.";

    // Call Python FastAPI AI Worker if files exist
    try {
        if (imageFile || audioFile) {
            const formData = new FormData();
            if (imageFile) {
                formData.append('image', fs.createReadStream(imageFile.path), imageFile.filename);
            }
            if (audioFile) {
                formData.append('audio', fs.createReadStream(audioFile.path), audioFile.filename);
            }

            const aiResponse = await axios.post('http://localhost:8000/analyze', formData, {
                headers: formData.getHeaders(),
                timeout: 10000
            });

            if (aiResponse.data) {
                aiTags = aiResponse.data.vision_analysis || [];
                transcript = aiResponse.data.voice_transcript || transcript;
            }
        }
    } catch (aiErr) {
        console.warn('AI worker offline or timeout. Defaulting to field data:', aiErr.message);
    }

    try {
        // Save entry
        const entryInsert = await db.query(`
            INSERT INTO entries (wbs_id, progress, quantity, unit, lat, lng, image_path, audio_path, transcript, ai_tags, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'SYNCED')
            RETURNING *;
        `, [
            wbs_id, progress, quantity, unit || 'Units',
            lat || 27.47, lng || 95.02,
            imageFile ? imageFile.filename : null,
            audioFile ? audioFile.filename : null,
            transcript, JSON.stringify(aiTags)
        ]);

        // Update target leaf activity
        await db.query(`
            UPDATE wbs_nodes 
            SET progress = $1, 
                status = CASE WHEN $1 < planned_progress - 5 THEN 'BEHIND' ELSE 'ON_TRACK' END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
        `, [progress, wbs_id]);

        // Execute upward rollup to root
        await recalculateRollup(wbs_id);

        res.status(200).json({
            success: true,
            entry: entryInsert.rows[0],
            ai: { tags: aiTags, transcript }
        });
    } catch (err) {
        console.error('Error during sync processing:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 2. Project Executive Overview
router.get('/stats', async (req, res) => {
    try {
        const rootRes = await db.query("SELECT * FROM wbs_nodes WHERE level = 1 LIMIT 1");
        const root = rootRes.rows[0] || { progress: 68.4, planned_progress: 74.0 };

        const disciplines = await db.query(`
            SELECT discipline, ROUND(AVG(progress)::numeric, 1) as progress
            FROM wbs_nodes 
            WHERE level >= 4 AND discipline != 'Project Management'
            GROUP BY discipline
        `);

        const alertsCount = await db.query("SELECT COUNT(*) FROM delay_alerts");
        const entriesCount = await db.query("SELECT COUNT(*) FROM entries WHERE created_at >= CURRENT_DATE");

        res.json({
            overall_progress: root.progress,
            planned_baseline: root.planned_progress,
            variance: (root.progress - root.planned_progress).toFixed(1),
            open_alerts: parseInt(alertsCount.rows[0].count, 10),
            synced_today: parseInt(entriesCount.rows[0].count, 10),
            disciplines: disciplines.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. WBS Tree Endpoint
router.get('/wbs', async (req, res) => {
    try {
        const nodes = await db.query('SELECT * FROM wbs_nodes ORDER BY level ASC, code ASC');
        res.json(nodes.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Live Entries & HITL Queue Endpoint
router.get('/entries', async (req, res) => {
    try {
        const entries = await db.query(`
            SELECT e.*, w.name as task_name, w.code as task_code, w.discipline
            FROM entries e
            JOIN wbs_nodes w ON e.wbs_id = w.id
            ORDER BY e.created_at DESC
        `);
        res.json(entries.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Active Delay Alerts Endpoint
router.get('/alerts', async (req, res) => {
    try {
        const alerts = await db.query('SELECT * FROM delay_alerts ORDER BY created_at DESC');
        res.json(alerts.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 9. Admin Sync Health & Conflicts Endpoint
router.get('/admin/sync-health', async (req, res) => {
    try {
        const conflictsRes = await db.query('SELECT * FROM sync_conflicts ORDER BY created_at DESC');
        const devicesRes = await db.query('SELECT COUNT(*) FROM entries WHERE created_at >= NOW() - INTERVAL \'24 hours\'');
        
        res.json({
            devices_online: 47,
            pending_sync: 8,
            conflicts_count: conflictsRes.rows.filter(c => c.status === 'UNRESOLVED').length,
            sync_success_rate: 94,
            conflicts: conflictsRes.rows
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Resolve Conflict Action Endpoint
router.post('/admin/resolve-conflict', async (req, res) => {
    const { conflict_id, resolution } = req.body; // resolution: 'MOBILE', 'MANUAL', or 'UNRESOLVED'
    try {
        await db.query(`
            UPDATE sync_conflicts 
            SET status = 'RESOLVED_' || $1 
            WHERE id = $2
        `, [resolution, conflict_id]);
        res.json({ success: true, message: `Conflict resolved using ${resolution} data source.` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// 10. Admin Conflicts Endpoint
router.get('/admin/conflicts-list', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sync_conflicts ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 11. Admin Devices Endpoint
router.get('/admin/devices', async (req, res) => {
    try {
        res.json([
            { id: 1, device_name: "iPhone 14 — Field Unit Alpha", role: "Site Engineer", status: "Online", last_sync: "2 mins ago", ip: "192.168.1.45" },
            { id: 2, device_name: "iPad Pro — Inspector Beta", role: "HSE Inspector", status: "Online", last_sync: "5 mins ago", ip: "192.168.1.52" },
            { id: 3, device_name: "Rugged Tab — Field Gamma", role: "Site Engineer", status: "Offline", last_sync: "3 hours ago", ip: "192.168.2.11" },
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 12. Admin Users Endpoint
router.get('/admin/users', async (req, res) => {
    try {
        res.json([
            { id: 1, name: "System Administrator", role: "Admin", access: "Full Control", status: "Active" },
            { id: 2, name: "Project Manager Control", role: "Project Manager", access: "Sector 7B", status: "Active" },
            { id: 3, name: "Lead Field Engineer", role: "Site Engineer", access: "Area C3", status: "Active" },
        ]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 13. Admin Audit Logs Endpoint

router.get('/admin/audit-logs', async (req, res) => {
    try {
        const logs = await db.query(`
            SELECT e.id, w.name as activity, e.status, e.created_at
            FROM entries e
            JOIN wbs_nodes w ON e.wbs_id = w.id
            ORDER BY e.created_at DESC LIMIT 20
        `);
        res.json(logs.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 14. Engineer Submissions & Sync Queue Endpoint
router.get('/engineer/submissions', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT e.*, w.name as task_name, w.code as task_code, w.discipline
            FROM entries e
            JOIN wbs_nodes w ON e.wbs_id = w.id
            ORDER BY e.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 15. Engineer Projects Endpoint
router.get('/engineer/projects', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM wbs_nodes WHERE level = 1
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;