import bcrypt from 'bcryptjs';
import pool from './init.js';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Check if users already exist
    const userCheck = await pool.query('SELECT COUNT(*) as count FROM users').catch(() => ({ rows: [{ count: 0 }] }));
    
    if (parseInt(String(userCheck.rows[0].count)) > 0) {
      console.log('✅ Database already seeded');
      await pool.end();
      process.exit(0);
    }

    // Seed users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await pool.query(
      `INSERT INTO users (username, password, name, role) 
       VALUES 
       ($1, $2, $3, $4),
       ($5, $2, $6, $7),
       ($8, $2, $9, $10)`,
      [
        'admin', hashedPassword, 'Admin User', 'admin',
        'manager', hashedPassword, 'Manager User', 'manager',
        'accountant', hashedPassword, 'Accountant User', 'accountant'
      ]
    );

    console.log('✅ Users seeded');

    // Seed employees
    await pool.query(`
      INSERT INTO employees (name, email, department, position) VALUES
      ('John Doe', 'john@example.com', 'IT', 'Developer'),
      ('Jane Smith', 'jane@example.com', 'HR', 'HR Manager'),
      ('Bob Johnson', 'bob@example.com', 'Finance', 'Accountant'),
      ('Alice Williams', 'alice@example.com', 'IT', 'DevOps Engineer'),
      ('Charlie Brown', 'charlie@example.com', 'Sales', 'Sales Manager')
    `);

    console.log('✅ Employees seeded');
    console.log('🎉 Database seeding completed');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

seedDatabase();
