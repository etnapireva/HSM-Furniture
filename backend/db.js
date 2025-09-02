// File: db.js

const express = require("express");
const cors    = require("cors");
const mysql   = require("mysql2");

const app  = express();
const PORT = 5001;

// 1) JSON parsing
app.use(express.json());

// 2) CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET","POST","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization","auth-token"],
  })
);

// 3) MySQL connection
const db = mysql.createConnection({
  host:     "localhost",
  user:     "etna",
  password: "Etna1234",
  database: "hsm-furniture",
});
db.connect(err => {
  if (err) {
    console.error(" Database connection failed:", err);
    process.exit(1);
  }
  console.log(" Connected to MySQL Database");
});

// 4) Checkout endpoint
app.post("/api/checkout", (req, res) => {
  console.log("> Incoming checkout payload:", req.body);

  // Destructure and coerce types
  const { product_id, quantity, total_price, user_id } = req.body;
  const pid   = String(product_id);    // VARCHAR(50)
  const qty   = Number(quantity);      // INT
  const price = Number(total_price);   // DECIMAL
  const uid   = Number(user_id) || null; // INT NULLABLE

  // Validate numbers
  if (!pid || Number.isNaN(qty) || Number.isNaN(price)) {
    console.warn("⚠️ Invalid payload:", { pid, qty, price, uid });
    return res.status(400).json({ error: "Invalid fields" });
  }

  // Insert four values to match your schema
  const sql = `
    INSERT INTO orders 
      (product_id, quantity, total_price, user_id)
    VALUES (?,?,?,?)
  `;
  db.query(sql, [pid, qty, price, uid], (err, result) => {
    if (err) {
      console.error(" MySQL error inserting order:", err.sqlMessage || err);
      return res
        .status(500)
        .json({ error: "Failed to place order", details: err.sqlMessage });
    }
    console.log(` Order #${result.insertId} placed`, { pid, qty, price, uid });
    res.status(200).json({
      message:  "Order placed successfully",
      order_id: result.insertId
    });
  });
});

// 5) Start server
app.listen(PORT, () =>
  console.log(` MySQL checkout server listening on http://localhost:${PORT}`)
);
