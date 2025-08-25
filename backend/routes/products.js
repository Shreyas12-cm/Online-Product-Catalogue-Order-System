const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

//  GET all products 
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error("Products fetch error:", err);
    res.status(500).json({ error: "Failed to load products. Please try again later." });
  }
});

// ADD new product (only admin)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admin can add products" });
    }

    const { name, description, price, stock } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO products (name, description, price, stock) VALUES (?,?,?,?)",
      [name, description || "", price, stock || 0]
    );

    res.status(201).json({ message: "Product added", productId: result.insertId });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Failed to add product. Please try again." });
  }
});

//  GET single product
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Single product fetch error:", err);
    res.status(500).json({ error: "Failed to load product. Please try again later." });
  }
});

module.exports = router;