import express from 'express';
import { pool } from '../database/init.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all employees
router.get('/', verifyToken, async (req: any, res: any) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get employee by ID
router.get('/:id', verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Create employee
router.post('/', verifyToken, async (req: any, res: any) => {
  try {
    const { name, email, department, position } = req.body;
    
    const result = await pool.query(
      'INSERT INTO employees (name, email, department, position) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, department, position]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
router.put('/:id', verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, email, department, position } = req.body;
    
    const result = await pool.query(
      'UPDATE employees SET name = $1, email = $2, department = $3, position = $4 WHERE id = $5 RETURNING *',
      [name, email, department, position, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
router.delete('/:id', verifyToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
