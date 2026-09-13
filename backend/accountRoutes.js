const bcrypt = require("bcrypt");
const { User, Order, Review } = require("./models");
const { findProduct } = require("./catalog");

function formatOrder(order) {
  const customer = order.customer || {};
  return {
    id: String(order._id),
    product_id: order.product_id,
    product_name: order.product_name || "",
    product_image: order.product_image || "",
    quantity: order.quantity,
    total_price: order.total_price,
    status: order.status || "pending",
    payment_status: order.payment_status || "pending",
    payment_method: order.payment_method || "manual",
    created_at: order.createdAt,
    full_name: customer.fullName || "",
    address: customer.address || "",
    city: customer.city || "",
    postal_code: customer.postalCode || "",
    phone: customer.phone || "",
    note: customer.note || "",
  };
}

function groupOrders(orders) {
  return orders.reduce((groups, order) => {
    const date = new Date(order.created_at).toLocaleDateString("sq-AL");
    groups[date] = groups[date] || [];
    groups[date].push(order);
    return groups;
  }, {});
}

async function findUserOrders(userId) {
  const orders = await Order.find({ user_id: String(userId) }).sort({ createdAt: -1 });
  return orders.map(formatOrder);
}

function attachAccountRoutes(app, { fetchuser }) {
  app.get("/api/user/dashboard", fetchuser, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const orders = await findUserOrders(user._id);
    res.json({
      user: {
        name: user.name,
        email: user.email,
        profile: user.profile || {},
        stats: {
          totalOrders: orders.length,
          wishlistItems: (user.wishlist || []).length,
          accountSince: user.createdAt || user._id.getTimestamp(),
        },
      },
    });
  });

  app.get("/api/user/orders", fetchuser, async (req, res) => {
    res.json({ orders: await findUserOrders(req.user.id) });
  });

  app.get("/user/orders", fetchuser, async (req, res) => {
    const orders = await findUserOrders(req.user.id);
    res.json({ orders, groupedOrders: groupOrders(orders) });
  });

  app.put("/api/user/profile", fetchuser, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.profile = {
      firstName: req.body.firstName || "",
      lastName: req.body.lastName || "",
      phone: req.body.phone || "",
      dateOfBirth: req.body.dateOfBirth || null,
    };
    await user.save();
    res.json({ success: true, profile: user.profile });
  });

  app.put("/api/user/change-password", fetchuser, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const match = await bcrypt.compare(currentPassword || "", user.password);
    if (!match) return res.status(400).json({ error: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true });
  });

  app.get("/user/wishlist", fetchuser, async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({ wishlist: user?.wishlist || [] });
  });

  app.post("/user/wishlist", fetchuser, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const item = req.body.productData || req.body;
    const id = String(item.productId || item._id || item.id || "");
    const exists = (user.wishlist || []).some((entry) => String(entry.productId || entry._id || entry.id) === id);
    if (!exists) {
      user.wishlist = [...(user.wishlist || []), item];
      await user.save();
    }
    res.json({ wishlist: user.wishlist });
  });

  app.delete("/user/wishlist/:productId", fetchuser, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const productId = String(req.params.productId);
    user.wishlist = (user.wishlist || []).filter((entry) => (
      String(entry.productId || entry._id || entry.id) !== productId
    ));
    await user.save();
    res.json({ wishlist: user.wishlist });
  });

  app.delete("/user/wishlist", fetchuser, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.wishlist = [];
    await user.save();
    res.json({ wishlist: [] });
  });

  app.get("/reviews/:productId", async (req, res) => {
    const reviews = await Review.find({ productId: String(req.params.productId) }).sort({ createdAt: -1 });
    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    res.json({
      success: true,
      reviews,
      averageRating,
      totalReviews: reviews.length,
    });
  });

  app.post("/reviews", fetchuser, async (req, res) => {
    const { productId, rating, comment } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    const existing = await Review.findOne({ productId: String(productId), userId: String(user._id) });
    if (existing) {
      existing.rating = Number(rating);
      existing.comment = comment || "";
      await existing.save();
    } else {
      await Review.create({
        productId: String(productId),
        userId: String(user._id),
        userName: user.name,
        rating: Number(rating),
        comment: comment || "",
      });
    }
    res.json({ success: true });
  });

  app.post("/api/payments/create-checkout-session", fetchuser, async (req, res) => {
    const { items = [], customer = {} } = req.body;
    if (!items.length) return res.status(400).json({ error: "Missing items" });

    for (const item of items) {
      const product = await findProduct(item.product_id);
      await Order.create({
        product_id: String(item.product_id),
        product_name: item.name || product?.name || "",
        product_image: product?.image || "",
        quantity: Number(item.quantity),
        total_price: Number(item.amount) * Number(item.quantity),
        user_id: String(req.user.id),
        status: "processing",
        payment_status: "completed",
        payment_method: "card",
        customer,
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.json({ url: `${frontendUrl}/order-success` });
  });

  app.post("/api/orders/save-stripe", fetchuser, async (_req, res) => {
    res.json({ success: true });
  });
}

module.exports = { attachAccountRoutes, formatOrder };
