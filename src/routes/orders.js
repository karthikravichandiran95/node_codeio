const express = require("express");
const router = express.Router();
// const { orders } = require("../data");
const Order = require("../models/Order");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// const findOrder = (req, res, next) => {
//   const order = orders.find((o) => o.id === parseInt(req.params.id));
//   if (!order) return res.status(404).json({ success: false, message: "Order not found" });
//   req.order = order;
//   next();
// };
const findOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  req.order = order;
  next();
};

// GET all orders - admin sees all, user sees own orders
// router.get("/", (req, res) => {
//   res.json({ success: true, data: orders });
// });
router.get("/", auth, async (req, res) => {
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
});

// GET single order
// router.get("/:id", findOrder, (req, res) => {
//   res.json({ success: true, data: req.order });
// });
router.get("/:id", auth, findOrder, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("product", "name price");
  res.json({ success: true, data: order });
});

// CREATE order - any logged in user
// router.post("/", (req, res) => {
//   const { userId, productId, quantity } = req.body;
//   const newOrder = { id: orders.length + 1, userId, productId, quantity, status: "pending" };
//   orders.push(newOrder);
//   res.status(201).json({ success: true, data: newOrder });
// });
router.post("/", auth, async (req, res) => {
  const { product, quantity } = req.body;
  const newOrder = await Order.create({
    user: req.user.id,
    product,
    quantity,
  });
  res.status(201).json({ success: true, data: newOrder });
});

// UPDATE order status - admin only
// router.put("/:id", findOrder, (req, res) => {
//   const { status, quantity } = req.body;
//   if (status) req.order.status = status;
//   if (quantity) req.order.quantity = quantity;
//   res.json({ success: true, data: req.order });
// });
router.put("/:id", auth, authorize("admin"), findOrder, async (req, res) => {
  const { status, quantity } = req.body;
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status, quantity },
    { new: true }
  );
  res.json({ success: true, data: updatedOrder });
});

// DELETE order - admin only
// router.delete("/:id", findOrder, (req, res) => {
//   const index = orders.indexOf(req.order);
//   orders.splice(index, 1);
//   res.json({ success: true, message: "Order deleted" });
// });
router.delete("/:id", auth, authorize("admin"), findOrder, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Order deleted" });
});

module.exports = router;
