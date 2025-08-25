const bcrypt = require('bcryptjs');
const pool = require('../db');
require('dotenv').config();

async function seedAdmin() {
  try {
    const email = 'admin@example.com';
    const password = 'Admin@123';

    // Check if admin already exists
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log('Admin already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin - to match database schema
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)',
      ['Admin', email, hashedPassword, 'admin']
    );

    console.log(` Seeded admin: ${email} / Password: ${password}`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

seedAdmin();