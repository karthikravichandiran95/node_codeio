const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middlewares/auth');
const asyncHandler = require('../utils/asyncHandler');

// GET cart
router.get('/', auth, asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  if (!cart) cart = { items: [] };
  res.json({ success: true, data: cart });
}));

// ADD to cart
router.post('/', auth, asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = new Cart({ user: req.user.id, items: [] });
  
  const existing = cart.items.find(i => i.product.toString() === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  cart = await Cart.findById(cart._id).populate('items.product');
  res.json({ success: true, data: cart });
}));

// UPDATE quantity
router.put('/:productId', auth, asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  const item = cart.items.find(i => i.product.toString() === req.params.productId);
  if (item) item.quantity = quantity;
  await cart.save();
  const updated = await Cart.findById(cart._id).populate('items.product');
  res.json({ success: true, data: updated });
}));

// CLEAR cart — /:productId ku ABOVE irukanum, illana "clear" nu word-a productId ah treat pannidum
router.delete('/clear', auth, asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
  res.json({ success: true, data: { items: [] } });
}));

// REMOVE item
router.delete('/:productId', auth, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
  await cart.save();
  const updated = await Cart.findById(cart._id).populate('items.product');
  res.json({ success: true, data: updated });
}));

module.exports = router;