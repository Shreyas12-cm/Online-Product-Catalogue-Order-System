const pool = require('../db');
require('dotenv').config();

async function cleanDatabase() {
  try {
    console.log(' COMPLETELY CLEANING PRODUCTS TABLE...');
    
    // First, delete all order_items 
    try {
      await pool.query('DELETE FROM order_items');
      console.log(' Deleted all order_items');
    } catch (err) {
      console.log('Note: Could not delete order_items (might not exist yet)');
    }
    
    // Now delete ALL products
    const [result] = await pool.query('DELETE FROM products');
    console.log(` Deleted ${result.affectedRows} products`);
    
    console.log(' Database completely cleaned! Ready for fresh products.');
  } catch (err) {
    console.error(' Error cleaning database:', err);
  } finally {
    process.exit();
  }
}

cleanDatabase();