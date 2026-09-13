const mongoose = require("mongoose");

const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  role: { type: String, default: "user" },
  wishlist: { type: Array, default: [] },
  profile: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    dateOfBirth: { type: Date, default: null },
  },
}, { timestamps: true }));

const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  image: String,
  category: String,
  price: Number,
  available: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
}));

const Order = mongoose.models.Order || mongoose.model("Order", new mongoose.Schema({
  product_id: { type: String, required: true },
  product_name: { type: String, default: "" },
  product_image: { type: String, default: "" },
  quantity: { type: Number, required: true },
  total_price: { type: Number, required: true },
  user_id: { type: String, default: null },
  status: { type: String, default: "pending" },
  payment_status: { type: String, default: "pending" },
  payment_method: { type: String, default: "manual" },
  customer: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now },
}));

const Review = mongoose.models.Review || mongoose.model("Review", new mongoose.Schema({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, default: "" },
  rating: { type: Number, required: true },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
}));

module.exports = { User, Product, Order, Review };
