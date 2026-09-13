const express = require("express");
const { insertOrder } = require("./db");

const router = express.Router();

router.post("/checkout", async (req, res) => {
  const { product_id, quantity, total_price, user_id } = req.body;
  const pid = product_id;
  const qty = Number(quantity);
  const price = Number(total_price);

  if (!pid || Number.isNaN(qty) || Number.isNaN(price)) {
    return res.status(400).json({ error: "Invalid fields" });
  }

  try {
    const orderId = await insertOrder({
      product_id: pid,
      quantity: qty,
      total_price: price,
      user_id: user_id || null,
    });
    if (orderId == null) {
      return res.status(503).json({ error: "Order storage is not configured" });
    }
    res.status(200).json({
      message: "Order placed successfully",
      order_id: orderId,
    });
  } catch (err) {
    console.error("Error inserting order:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

module.exports = router;
