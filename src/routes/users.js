const express = require("express");
const router = express.Router();
const { matchedData } = require("express-validator");
// const { users } = require("../data"); // V1: in-memory data
const User = require("../models/User");
const { createUserValidator, updateUserValidator, userIdValidator } = require("../validators/userValidator");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const findUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError("User not found", 404);
  req.user = user;
  next();
});

// GET all users - admin only
router.get("/", auth, authorize("admin"), asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
}));

// GET single user
router.get("/:id", auth, userIdValidator, validate, findUser, (req, res) => {
  res.json({ success: true, data: req.user });
});

// CREATE user - admin only
router.post("/", auth, authorize("admin"), createUserValidator, validate, asyncHandler(async (req, res) => {
  const { name, email } = matchedData(req);
  const newUser = await User.create({ name, email });
  res.status(201).json({ success: true, data: newUser });
}));

// UPDATE user
router.put("/:id", auth, authorize("admin", "user"), updateUserValidator, validate, findUser, asyncHandler(async (req, res) => {
  const { name, email } = matchedData(req);
  const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
  res.json({ success: true, data: updatedUser });
}));

// DELETE user - admin only
router.delete("/:id", auth, authorize("admin"), userIdValidator, validate, findUser, asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
}));

module.exports = router;
