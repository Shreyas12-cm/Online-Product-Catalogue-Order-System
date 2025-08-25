const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/auth");
const { v4: uuidv4 } = require("uuid"); // for UUIDs


//  GET all orders for logged-in user 
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Get all orders of the user
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.userId]
    );

    // For each order, fetch its items
    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.product_id, p.name, oi.quantity, oi.price_at_order 
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error(" Error fetching orders:", err);
    res.status(500).json({ error: err.message });
  }
});

// POST create a new order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, delivery_address } = req.body; 

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "At least one product is required" });
    }

    if (!delivery_address) {
      return res.status(400).json({ error: "Delivery address required" });
    }

    // Step 1: Generate UUID for the order
    const orderId = uuidv4();

    // Step 2: Create the order
    await pool.query(
      "INSERT INTO orders (id, user_id, delivery_address, total_amount) VALUES (?, ?, ?, ?)",
      [orderId, req.user.userId, delivery_address, 0] // total will update later
    );

    let totalAmount = 0;

    // Step 3: Insert order_items
    for (const item of items) {
      const [productRows] = await pool.query(
        "SELECT price FROM products WHERE id = ?",
        [item.product_id]
      );

      if (productRows.length === 0) {
        return res.status(400).json({ error: `Invalid product_id ${item.product_id}` });
      }

      const productPrice = productRows[0].price;
      const lineTotal = productPrice * item.quantity;
      totalAmount += lineTotal;

      await pool.query(
        "INSERT INTO order_items (id, order_id, product_id, quantity, price_at_order) VALUES (?,?,?,?,?)",
        [uuidv4(), orderId, item.product_id, item.quantity, productPrice]
      );
    }

    // Step 4: Update total_amount in orders
    await pool.query("UPDATE orders SET total_amount = ? WHERE id = ?", [
      totalAmount,
      orderId,
    ]);

    res.status(201).json({ message: "Order placed", orderId, totalAmount });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
