const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const config = require("./config");
const { insertOrder, pingMysql, isMysqlConfigured } = require("./db");
const { User, Product, Order } = require("./models");
const { seedCatalog } = require("./seed");
const { attachAccountRoutes } = require("./accountRoutes");
const { catalogCount, listProducts, findProduct } = require("./catalog");

const app = express();

app.use(express.json());

app.use(cors({
  origin(origin, callback) {
    if (!origin || config.corsOrigins.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
  credentials: true,
}));

app.use("/images", express.static(path.join(__dirname, "upload/images")));

function fetchuser(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ errors: "Please authenticate" });
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch {
    res.status(401).json({ errors: "Please authenticate" });
  }
}

function optionalUser(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
  } catch {
    // Keep checkout working for the current shop cart, which may not send a token.
  }
  next();
}

async function saveOrder({ product_id, quantity, total_price, user_id, customer, payment_method }) {
  const product = await findProduct(product_id);
  const extra = {
    product_name: product?.name || "",
    product_image: product?.image || "",
    customer: customer || {},
    payment_method: payment_method || "manual",
    payment_status: "completed",
    status: "pending",
  };
  if (isMysqlConfigured()) {
    try {
      const orderId = await insertOrder({ product_id, quantity, total_price, user_id });
      if (orderId != null) {
        return { store: "mysql", order_id: orderId };
      }
    } catch (err) {
      console.error("MySQL checkout failed, falling back to Mongo:", err.message);
    }
  }

  const order = await Order.create({
    product_id: String(product_id),
    quantity: Number(quantity),
    total_price: Number(total_price),
    user_id: user_id ? String(user_id) : null,
    ...extra,
  });
  return { store: "mongo", order_id: order._id };
}

app.get("/health", async (_req, res) => {
  const mysqlOk = isMysqlConfigured() ? await pingMysql() : false;
  res.json({
    ok: mongoose.connection.readyState === 1,
    mongo: mongoose.connection.readyState === 1,
    mysql: mysqlOk,
    orders: mysqlOk ? "mysql" : "mongo",
  });
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ success: false, errors: "Email already in use" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: username, email, password: hashed });
    const payload = { user: { id: user._id, role: user.role } };
    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
    const refreshToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "30d" });
    res.json({ success: true, accessToken, refreshToken });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

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
    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
    const refreshToken = jwt.sign(payload, config.jwtSecret, { expiresIn: "30d" });
    res.json({ success: true, accessToken, refreshToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (_req, res) => {
  res.json({ name: "HSM Furniture API", health: "/health" });
});

app.get("/allproducts", async (_req, res) => {
  try {
    res.json(await listProducts());
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/product/:productId", async (req, res) => {
  try {
    const product = await findProduct(req.params.productId);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Product error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/relatedproducts", async (req, res) => {
  try {
    const { category } = req.body || {};
    const related = (await listProducts({ category })).slice(0, 8);
    res.json(related);
  } catch (err) {
    console.error("Related products error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/search", async (req, res) => {
  try {
    const { q, minPrice, maxPrice, category, sort } = req.query;
    const results = await listProducts({ q, minPrice, maxPrice, category, sort });
    res.json({
      products: results,
      pagination: {
        total: results.length,
        page: 1,
        limit: results.length || 100,
        totalPages: 1,
      },
      filters: { q, minPrice, maxPrice, category, sort },
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

attachAccountRoutes(app, { fetchuser });

app.post("/addtocart", fetchuser, (_req, res) => {
  res.json({ success: true });
});

app.post("/removefromcart", fetchuser, (_req, res) => {
  res.json({ success: true });
});

app.post("/getcart", fetchuser, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.cartData);
});

app.post("/api/checkout", optionalUser, async (req, res) => {
  const { product_id, quantity, total_price, user_id, customer } = req.body;
  const qty = Number(quantity);
  const price = Number(total_price);

  if (!product_id || Number.isNaN(qty) || Number.isNaN(price)) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const saved = await saveOrder({
      product_id,
      quantity: qty,
      total_price: price,
      user_id: req.user?.id || user_id || null,
      customer,
      payment_method: "manual",
    });
    res.json({ success: true, order_id: saved.order_id, store: saved.store });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Order failed" });
  }
});

async function start() {
  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB");

  const realCatalog = await catalogCount();
  if (realCatalog === 0 && (await Product.countDocuments()) === 0) {
    console.log("Empty catalog; seeding demo products and user");
    await seedCatalog();
  } else {
    console.log(`Catalog ready: ${realCatalog} products from category collections`);
  }

  if (isMysqlConfigured()) {
    const mysqlOk = await pingMysql();
    if (mysqlOk) {
      console.log("Connected to MySQL (orders)");
    } else {
      console.log("MySQL configured but unreachable; orders will be stored in Mongo");
    }
  } else {
    console.log("MySQL not configured; orders will be stored in Mongo");
  }

  app.listen(config.port, "0.0.0.0", () => {
    console.log(`API listening on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
