const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");
const auth = require("../middlewares/auth");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const sendEmail = require("../utils/sendEmail");
const { log } = require("console");

// POST /api/auth/signup
router.post("/signup", asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, phone, password: hashedPassword });

  // Send welcome email in background — don't block signup if it fails
  sendEmail(
    email,
    "Welcome to Node CodeIO!",
    `<h1>Welcome, ${name}!</h1>
     <p>Your account has been created successfully.</p>
     <p>Thank you for joining Node CodeIO!</p>`
  ).catch((err) => console.error("Welcome email failed:", err.message));

  res.status(201).json({ success: true, message: "Account created!" });
}));

// POST /api/auth/login
router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }
  const accessToken = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.API_SECRET, { expiresIn: "1d" });
  const refreshToken = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

  res.json({
    success: true,
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
  });
}));

// POST /api/auth/refresh
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token required" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id, name: decoded.name, role: decoded.role }, process.env.API_SECRET, { expiresIn: "1d" });
    res.json({ success: true, accessToken });
    console.log("acees token", accessToken);
    
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found with this email", 404);
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail(
    email,
    "Password Reset - Node CodeIO",
    `<h1>Password Reset Request</h1>
     <p>You requested a password reset.</p>
     <p>Click the link below to reset your password:</p>
     <a href="${resetUrl}">${resetUrl}</a>
     <p>This link expires in 10 minutes.</p>
     <p>If you didn't request this, ignore this email.</p>`
  );

  res.json({ success: true, message: "Password reset email sent!" });
}));

// POST /api/auth/reset-password
router.post("/reset-password", asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) throw new AppError("Invalid or expired reset token", 400);
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.json({ success: true, message: "Password reset successful!" });
}));

// POST /api/auth/logout
router.post("/logout", auth, asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  await BlacklistedToken.create({ token });
  res.json({ success: true, message: "Logged out successfully" });
}));

module.exports = router;
