const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./db"); 

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

//  request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

//  Import Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const ordersRoute = require("./routes/orders");


app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 as test");
    res.json({ database: "Connected successfully", result: rows });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ database: "Connection failed", error: err.message });
  }
});


app.get("/debug", async (req, res) => {
  const results = {
    server: "OK",
    database: "Unknown",
    products_table: "Unknown",
    users_table: "Unknown"
  };

  try {
    // Test database connection
    const [dbTest] = await pool.query("SELECT 1 as test");
    results.database = "Connected";
    
    // Test products table
    try {
      const [products] = await pool.query("SELECT COUNT(*) as count FROM products");
      results.products_table = `Exists (${products[0].count} products)`;
    } catch (e) {
      results.products_table = `Error: ${e.message}`;
    }
    
    // Test users table
    try {
      const [users] = await pool.query("SELECT COUNT(*) as count FROM users");
      results.users_table = `Exists (${users[0].count} users)`;
    } catch (e) {
      results.users_table = `Error: ${e.message}`;
    }
    
  } catch (err) {
    results.database = `Error: ${err.message}`;
  }

  res.json(results);
});

// Register Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", ordersRoute);

// Root test
app.get("/", (req, res) => {
  res.send("✅ API is running successfully!");
});


app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));