// index.js
const express  = require("express");
const mongoose = require("mongoose");
const jwt      = require("jsonwebtoken");
const path     = require("path");
const cors     = require("cors");
const mysql    = require("mysql2");
const bcrypt   = require("bcrypt");
require("dotenv").config();

const app  = express();
const port = process.env.PORT || 4001;

// 1) Parse JSON bodies
app.use(express.json());

// 2) Enable CORS for React app
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET","POST","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","auth-token"],
  credentials: true,
}));

// 3) Serve images under /images/...
// AFTER cors middleware
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// 4) MongoDB connection (include your DB name)
const mongoUri = process.env.MONGO_URI
  || "mongodb+srv://etnaHP:Etna1234@cluster0.8sge73d.mongodb.net/";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// 5) MySQL connection for orders
const db = mysql.createConnection({
  host:     "localhost",
  user:     "etna",
  password: "Etna1234",
  database: "hsm-furniture",
});
db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err);
    process.exit(1);
  }
  console.log(" Connected to MySQL Database (orders)");
});

// 6) Mongoose models
const User = mongoose.model("User", new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  role:     { type: String, default: "user" },
}));

const Product = mongoose.model("Product", new mongoose.Schema({
  id:          Number,
  name:        String,
  description: String,
  image:       String,
  category:    String,
  price:       Number,
  available:   { type: Boolean, default: true },
  date:        { type: Date, default: Date.now },
}));
Product.schema.index({ name: "text", description: "text" });

// 7) Auth middleware
function fetchuser(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ errors: "Please authenticate" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch {
    res.status(401).json({ errors: "Please authenticate" });
  }
}

// 8) Routes

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, errors: "Email already in use" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: username, email, password: hashed });
    const payload = { user: { id: user._id, role: user.role } };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ success: true, accessToken });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, errors: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, errors: "Invalid credentials" });
    }
    const payload = { user: { id: user._id, role: user.role } };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ success: true, accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Public: list all products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Public: search with text, price, category, sort
app.get("/search", async (req, res) => {
  try {
    const { q, minPrice, maxPrice, category, sort } = req.query;
    const filter = {};
    if (q)         filter.$text    = { $search: q };
    if (minPrice)  filter.price    = { ...filter.price, $gte: +minPrice };
    if (maxPrice)  filter.price    = { ...filter.price, $lte: +maxPrice };
    if (category)  filter.category = category;
    let sortObj = {};
    if (sort === "price_asc")  sortObj.price = 1;
    if (sort === "price_desc") sortObj.price = -1;
    if (sort === "newest")     sortObj.date  = -1;
    const results = await Product.find(filter).sort(sortObj).limit(100);
    res.json(results);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Protected: cart & checkout
app.post("/addtocart", fetchuser, (req, res) => {
  // original cart logic here
  res.json({ success: true });
});
app.post("/removefromcart", fetchuser, (req, res) => {
  // original remove logic here
  res.json({ success: true });
});
app.post("/getcart", fetchuser, async (req, res) => {
  const u = await User.findById(req.user.id);
  res.json(u.cartData);
});
// Protected: checkout requires auth-token
app.post("/api/checkout", fetchuser, (req, res) => {
  const { product_id, quantity, total_price } = req.body;
  if (!product_id || !quantity || !total_price) {
    return res.status(400).json({ error: "Missing fields" });
  }
  const sql = `
    INSERT INTO orders
      (product_id, quantity, total_price, user_id)
    VALUES (?, ?, ?, ?)
  `;
  db.query(
    sql,
    [product_id, quantity, total_price, req.user.id],
    (err, result) => {
      if (err) {
        console.error("Checkout error:", err);
        return res.status(500).json({ error: "Order failed" });
      }
      console.log("Order inserted, ID:", result.insertId);
      res.json({ success: true, order_id: result.insertId });
    }
  );
});


// Start server
app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);
});
