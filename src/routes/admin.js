const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/dashboard — Admin dashboard stats
router.get("/dashboard", auth, authorize("admin"), asyncHandler(async (req, res) => {

  // Simple counts
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  // Total revenue — all orders amount add pannu
  const revenueResult = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Order status counts — group by status
  const orderStatusCounts = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  // Recent 5 orders — latest first
  const recentOrders = await Order.find()
    .populate("user", "name email")
    .populate("product", "name price image")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      orderStatusCounts,
      recentOrders,
    },
  });
}));

module.exports = router;
