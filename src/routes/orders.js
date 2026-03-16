const express = require("express");
const router = express.Router();
// const { orders } = require("../data"); // V1: in-memory data
const Order = require("../models/Order");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const asyncHandler = require("../utils/asyncHandler");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { sendSMS, sendWhatsApp } = require("../utils/sendSMS");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

const findOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);
  req.order = order;
  next();
});

// GET all orders
router.get("/", auth, asyncHandler(async (req, res) => {
  let orders;
  if (req.user.role === "admin") {
    orders = await Order.find()
      .populate("user", "name email")
      .populate("product", "name price");
  } else {
    orders = await Order.find({ user: req.user.id })
      .populate("product", "name price");
  }
  res.json({ success: true, data: orders });
}));

// GET single order
router.get("/:id", auth, findOrder, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("product", "name price");
  res.json({ success: true, data: order });
}));

// CREATE order
router.post("/", auth, asyncHandler(async (req, res) => {
  const { product, quantity, phone } = req.body;

  // Product details fetch panni amount calculate pannu
  const productData = await Product.findById(product);
  if (!productData) throw new AppError("Product not found", 404);

  // Stock check — enough stock irukka nu paaru
  if (productData.stock < quantity) {
    throw new AppError(`Only ${productData.stock} items left in stock`, 400);
  }

  const amount = productData.price * quantity;

  const newOrder = await Order.create({
    user: req.user.id,
    product,
    productName: productData.name,
    amount,
    quantity,
    phone,
  });

  // Stock reduce pannu
  productData.stock -= quantity;
  await productData.save();

  // Order confirm aana apram SMS + WhatsApp anuppu
  const message = `Hi! Your order for "${productData.name}" (Qty: ${quantity}) has been placed successfully! Amount: Rs.${amount}. Order ID: ${newOrder._id}. Thank you for shopping with CodeIO!`;

  try {
    await sendSMS(phone, message);
  } catch (err) {
    console.log("SMS failed:", err.message);
  }

  try {
    await sendWhatsApp(phone, message);
  } catch (err) {
    console.log("WhatsApp failed:", err.message);
  }

  // Order confirmation email anuppu
  try {
    const user = await User.findById(req.user.id);
    await sendEmail(
      user.email,
      "Order Placed Successfully - CodeIO",
      `<h2>Order Confirmation</h2>
       <p>Hi ${user.name},</p>
       <p>Your order has been placed successfully!</p>
       <table style="border-collapse:collapse;width:100%">
         <tr><td><strong>Product:</strong></td><td>${productData.name}</td></tr>
         <tr><td><strong>Quantity:</strong></td><td>${quantity}</td></tr>
         <tr><td><strong>Amount:</strong></td><td>Rs.${amount}</td></tr>
         <tr><td><strong>Order ID:</strong></td><td>${newOrder._id}</td></tr>
         <tr><td><strong>Status:</strong></td><td>Pending</td></tr>
       </table>
       <p>Thank you for shopping with CodeIO!</p>`
    );
  } catch (err) {
    console.log("Email failed:", err.message);
  }

  res.status(201).json({ success: true, data: newOrder });
}));

// UPDATE order status - admin only
router.put("/:id", auth, authorize("admin"), findOrder, asyncHandler(async (req, res) => {
  const { status, quantity } = req.body;
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status, quantity },
    { new: true }
  );
  res.json({ success: true, data: updatedOrder });
}));

// DELETE order - admin only
router.delete("/:id", auth, authorize("admin"), findOrder, asyncHandler(async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Order deleted" });
}));

module.exports = router;
