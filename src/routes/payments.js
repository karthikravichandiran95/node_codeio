const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const auth = require("../middlewares/auth");
const Order = require("../models/Order");
const Product = require("../models/Product");

// POST /api/payments/create-payment-intent
// Frontend calls this to start a payment
router.post("/create-payment-intent", auth, async (req, res) => {
  console.log("\n===== CREATE PAYMENT INTENT =====");
  console.log("Step 1: Request received from frontend");
  console.log("Body:", req.body);
  console.log("User from token:", req.user);

  const { amount, productId, quantity } = req.body;

  console.log("Step 2: Extracted values:");
  console.log("  amount:", amount);
  console.log("  productId:", productId);
  console.log("  quantity:", quantity);

  // amount = Rs. value (e.g., 999)
  // Stripe expects paise (smallest unit), so 999 * 100 = 99900 paise
  console.log("Step 3: Creating PaymentIntent with Stripe...");
  console.log("  amount in paise:", amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "inr",
    metadata: {
      userId: req.user.id,
      productId: productId,
      quantity: String(quantity || 1),
    },
  });

  console.log("Step 4: Stripe PaymentIntent created!");
  console.log("  paymentIntentId:", paymentIntent.id);
  console.log("  clientSecret:", paymentIntent.client_secret);
  console.log("  metadata:", paymentIntent.metadata);
  console.log("===== SENDING RESPONSE TO FRONTEND =====\n");

  // Send clientSecret + paymentIntentId to frontend
  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

// POST /api/payments/confirm-payment
// Frontend calls this AFTER Stripe payment succeeds
router.post("/confirm-payment", auth, async (req, res) => {
  console.log("\n===== CONFIRM PAYMENT =====");
  console.log("Step 1: Confirm request received from frontend");
  console.log("Body:", req.body);
  console.log("User from token:", req.user);

  const { paymentIntentId } = req.body;
  console.log("Step 2: paymentIntentId:", paymentIntentId);

  // 1. Stripe kitta payment verify panrom
  console.log("Step 3: Verifying payment with Stripe...");
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  console.log("Step 4: Stripe response:");
  console.log("  status:", paymentIntent.status);
  console.log("  metadata:", paymentIntent.metadata);

  // 2. Payment succeeded ah check
  if (paymentIntent.status !== "succeeded") {
    console.log("Step 5: FAILED - Payment status is:", paymentIntent.status);
    return res.status(400).json({
      success: false,
      message: "Payment not completed",
    });
  }

  console.log("Step 5: Payment verified - status is succeeded!");

  // 3. Metadata la irundhu product info edukrom
  const { productId, quantity } = paymentIntent.metadata;
  console.log("Step 6: Extracted from metadata:");
  console.log("  productId:", productId);
  console.log("  quantity:", quantity);

  // 4. Product name fetch from DB
  console.log("Step 7: Fetching product details from DB...");
  const product = await Product.findById(productId);
  console.log("  productName:", product ? product.name : "NOT FOUND");

  // 5. Order create in DB
  console.log("Step 8: Creating order in MongoDB...");
  const order = await Order.create({
    user: req.user.id,
    product: productId,
    productName: product ? product.name : "",
    amount: paymentIntent.amount / 100,
    quantity: Number(quantity),
    status: "confirmed",
  });
  console.log("Step 9: Order created in DB!");
  console.log("  orderId:", order._id);
  console.log("  order:", order);
  console.log("===== ORDER COMPLETE =====\n");

  res.status(201).json({
    success: true,
    message: "Payment successful, order created!",
    data: order,
  });
});

module.exports = router;
