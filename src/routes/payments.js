const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const auth = require("../middlewares/auth");
const Order = require("../models/Order");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// POST /api/payments/create-payment-intent
router.post("/create-payment-intent", auth, asyncHandler(async (req, res) => {
  const { amount, productId, quantity } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
    metadata: {
      userId: req.user.id,
      productId: productId,
      quantity: String(quantity || 1),
    },
  });
  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
}));

// POST /api/payments/confirm-payment
router.post("/confirm-payment", auth, asyncHandler(async (req, res) => {
  const { paymentIntentId } = req.body;
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    throw new AppError("Payment not completed", 400);
  }
  const { productId, quantity } = paymentIntent.metadata;
  const product = await Product.findById(productId);

  // Stock check — enough stock irukka nu paaru
  if (!product) throw new AppError("Product not found", 404);
  if (product.stock < Number(quantity)) {
    throw new AppError(`Only ${product.stock} items left in stock`, 400);
  }

  const order = await Order.create({
    user: req.user.id,
    product: productId,
    productName: product ? product.name : "",
    amount: paymentIntent.amount / 100,
    quantity: Number(quantity),
    status: "confirmed",
  });

  // Stock reduce pannu
  product.stock -= Number(quantity);
  await product.save();

  res.status(201).json({
    success: true,
    message: "Payment successful, order created!",
    data: order,
  });
}));

// POST /api/payments/create-cart-payment-intent
router.post("/create-cart-payment-intent", auth, asyncHandler(async (req, res) => {
  const { amount, items } = req.body;

  if (!amount || !items || !items.length) {
    throw new AppError("Amount and items are required", 400);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: "usd",
    metadata: {
      userId: req.user.id,
      type: "cart",
    },
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
}));

// POST /api/payments/confirm-cart-payment
router.post("/confirm-cart-payment", auth, asyncHandler(async (req, res) => {
  const { paymentIntentId, items } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    throw new AppError("Payment not completed", 400);
  }

  const orders = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    // Stock check
    if (product.stock < item.quantity) {
      throw new AppError(`${product.name}: Only ${product.stock} left in stock`, 400);
    }

    // Order create
    const order = await Order.create({
      user: req.user.id,
      product: item.productId,
      productName: product.name,
      amount: product.price * item.quantity,
      quantity: item.quantity,
      status: "confirmed",
    });

    // Stock reduce
    product.stock -= item.quantity;
    await product.save();

    orders.push(order);
  }

  res.status(201).json({
    success: true,
    message: "Payment successful, orders created!",
    data: orders,
  });
}));

module.exports = router;
