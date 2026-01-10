#!/usr/bin/env node
import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

async function seed() {
  try {
    console.log('🌱 Connecting to database...');
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connected at:', res.rows[0].now);

    // Create tables
    console.log('📝 Creating tables...');
    
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'manager',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(100),
      department VARCHAR(100),
      position VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
      date DATE NOT NULL,
      status_code VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(employee_id, date)
    )`);

    console.log('✅ Tables created');

    // Check if already seeded
    const check = await pool.query('SELECT COUNT(*) as cnt FROM users');
    if (check.rows[0].cnt > 0) {
      console.log('⏭️  Database already seeded');
      await pool.end();
      process.exit(0);
    }

    // Seed users
    console.log('👥 Seeding users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await pool.query(
      `INSERT INTO users (username, password, name, role) VALUES 
       ($1, $2, $3, $4), ($5, $6, $7, $8), ($9, $10, $11, $12)`,
      ['admin', hashedPassword, 'Admin User', 'admin',
       'manager', hashedPassword, 'Manager User', 'manager',
       'accountant', hashedPassword, 'Accountant User', 'accountant']
    );
    console.log('✅ Users seeded');

    // Seed employees
    console.log('👔 Seeding employees...');
    await pool.query(`
      INSERT INTO employees (name, email, department, position) VALUES
      ('John Doe', 'john@example.com', 'IT', 'Developer'),
      ('Jane Smith', 'jane@example.com', 'HR', 'HR Manager'),
      ('Bob Johnson', 'bob@example.com', 'Finance', 'Accountant')
    `);
    console.log('✅ Employees seeded');

    console.log('🎉 Seeding complete!');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

seed();
