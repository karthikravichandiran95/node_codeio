const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Email already irukka?
  // BEFORE: const existingUser = users.find((u) => u.email === email);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already exists" });
  }

  // Password hash
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  // BEFORE: const newUser = { id: users.length + 1, name, email, password: hashedPassword };
  // BEFORE: users.push(newUser);
  const newUser = await User.create({ name, email, password: hashedPassword });
  console.log("New User:", newUser);

  res.status(201).json({ success: true, message: "Account created!" });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Email irukka?
  // BEFORE: const user = users.find((u) => u.email === email);
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  // Password compare
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  // Access Token - 15 min expire
  // const accessToken = jwt.sign({ id: user.id, name: user.name }, process.env.API_SECRET, { expiresIn: "15m" });
  const accessToken = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.API_SECRET, { expiresIn: "1d" });

  // Refresh Token - 7 days expire
  // const refreshToken = jwt.sign({ id: user.id, name: user.name }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
  const refreshToken = jwt.sign({ id: user._id, name: user.name, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
  res.json({ success: true, accessToken, refreshToken });
});

// POST /api/auth/refresh
router.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Refresh token required" });
  }

  try {
    // Refresh token valid ah?
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    // New access token generate
    const accessToken = jwt.sign({ id: decoded.id, name: decoded.name, role: decoded.role }, process.env.API_SECRET, { expiresIn: "1d" });

    res.json({ success: true, accessToken });
  } catch (error) {
    console.log("Refresh token error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
});

module.exports = router;
