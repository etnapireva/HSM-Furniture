const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/checkout', (req, res) => {
  const { product_id, quantity, total_price, user_id } = req.body;

  const sql = 'INSERT INTO orders (product_id, quantity, total_price, user_id) VALUES (?, ?, ?, ?)';
  db.query(sql, [product_id, quantity, total_price, user_id || null], (err, result) => {
    if (err) {
      console.error('Error inserting order:', err);
      return res.status(500).json({ error: 'Failed to place order' });
    }
    res.status(200).json({ message: 'Order placed successfully', order_id: result.insertId });
  });
});

module.exports = router;