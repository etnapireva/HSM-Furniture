// backend/index.js

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5001;

// 1) Middleware për JSON
app.use(express.json());

// 2) Middleware CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3) Konfigurimi i MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "etna",
  password: "Etna1234",
  database: "hsm-furniture",
});
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL Database");
});

// 4) Endpoint për checkout
app.post("/api/checkout", (req, res) => {
  console.log("> Incoming checkout payload:", req.body);

  const { product_id, quantity, total_price, user_id } = req.body;

  if (
    product_id == null ||
    quantity == null ||
    total_price == null
  ) {
    console.log("⚠️ Missing fields in payload");
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql =
    "INSERT INTO orders (product_id, quantity, total_price, user_id) VALUES (?, ?, ?, ?)";

  const pid = Number(product_id);
  const qty = Number(quantity);
  const price = Number(total_price);
  const uid = user_id != null ? Number(user_id) : null;

  db.query(sql, [pid, qty, price, uid], (err, result) => {
    if (err) {
      console.error(
        "❌ MySQL error inserting order:",
        err.sqlMessage || err
      );
      return res
        .status(500)
        .json({ error: "Failed to place order" });
    }
    console.log(
      `✅ Order inserted with ID ${result.insertId} (product ${pid}, qty ${qty})`
    );
    res
      .status(200)
      .json({
        message: "Order placed successfully",
        order_id: result.insertId,
      });
  });
});

// 5) Nis server-in
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
