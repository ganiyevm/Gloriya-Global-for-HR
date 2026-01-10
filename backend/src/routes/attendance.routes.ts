import express from 'express';
import { pool } from '../database/init.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get attendance records
router.get('/', verifyToken, async (req: any, res: any) => {
  try {
    const { employeeId, date } = req.query;
    let query = `
      SELECT a.*, e.name as employee_name 
      FROM attendance a 
      JOIN employees e ON a.employee_id = e.id
    `;
    const params: any[] = [];

    if (employeeId) {
      query += ` WHERE a.employee_id = $${params.length + 1}`;
      params.push(employeeId);
    }

    if (date) {
      query += params.length > 0 ? ' AND' : ' WHERE';
      query += ` a.date = $${params.length + 1}`;
      params.push(date);
    }

    query += ' ORDER BY a.date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Create attendance record
router.post('/', verifyToken, async (req: any, res: any) => {
  try {
    const { employeeId, date, statusCode } = req.body;
    
    const result = await pool.query(
      `INSERT INTO attendance (employee_id, date, status_code) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (employee_id, date) 
       DO UPDATE SET status_code = $3 
       RETURNING *`,
      [employeeId, date, statusCode]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
});

// Bulk import attendance
router.post('/bulk-import', verifyToken, async (req: any, res: any) => {
  const client = await (pool as any).connect();
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'Records must be a non-empty array' });
    }

    // Normalize ids and gather unique employee ids
    const idSet = new Set<string>();
    const recordsNormalized: any[] = [];
    for (const r of records) {
      const employeeId = (r.employeeId || r.employee_id)?.toString();
      const date = r.date;
      const statusCode = r.statusCode || r.status_code || 'A';
      const employeeName = r.employeeName || r.employee_name || r.name || null;
      const department = r.department || null;
      const email = r.email || null;
      const position = r.position || null;

      if (!employeeId || !date) continue;

      idSet.add(employeeId);
      recordsNormalized.push({ employeeId, date, statusCode, employeeName, department, email, position });
    }

    if (recordsNormalized.length === 0) {
      return res.status(400).json({ error: 'No valid records to import' });
    }

    const ids = Array.from(idSet);

    await client.query('BEGIN');

    // Find existing employees
    const existingRes = await client.query('SELECT id FROM employees WHERE id = ANY($1::varchar[])', [ids]);
    const existingIds = new Set(existingRes.rows.map((r: any) => r.id));

    // Prepare new employees to insert
    const toCreate: any[] = [];
    const empInfoMap: Record<string, any> = {};
    for (const rec of recordsNormalized) {
      empInfoMap[rec.employeeId] = empInfoMap[rec.employeeId] || { name: rec.employeeName || `Employee ${rec.employeeId}`, email: rec.email, department: rec.department, position: rec.position };
    }
    for (const id of ids) {
      if (!existingIds.has(id)) {
        toCreate.push({ id, ...empInfoMap[id] });
      }
    }

    // Bulk insert new employees if any
    if (toCreate.length > 0) {
      const values: string[] = [];
      const params: any[] = [];
      let idx = 1;
      for (const e of toCreate) {
        values.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
        params.push(e.id, e.name || `Employee ${e.id}`, e.email || null, e.department || null, e.position || null);
      }
      const insertEmployeesQuery = `INSERT INTO employees (id, name, email, department, position) VALUES ${values.join(', ')} ON CONFLICT (id) DO NOTHING`;
      await client.query(insertEmployeesQuery, params);
    }

    // Bulk upsert attendance
    // Build multi-row insert with ON CONFLICT DO UPDATE
    const attendanceValues: string[] = [];
    const attendanceParams: any[] = [];
    let p = 1;
    for (const rec of recordsNormalized) {
      attendanceValues.push(`($${p++}, $${p++}, $${p++})`);
      attendanceParams.push(rec.employeeId, rec.date, rec.statusCode);
    }
    const attendanceQuery = `INSERT INTO attendance (employee_id, date, status_code) VALUES ${attendanceValues.join(', ')} ON CONFLICT (employee_id, date) DO UPDATE SET status_code = EXCLUDED.status_code`;
    const attendanceResult = await client.query(attendanceQuery, attendanceParams);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Bulk import completed',
      successCount: recordsNormalized.length,
      totalCount: records.length,
    });
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Bulk import error:', error);
    res.status(500).json({ error: 'Failed to import records' });
  } finally {
    client.release();
  }
});

export default router;
