const express = require("express");
const router = express.Router();
const { matchedData } = require("express-validator");
// const { users } = require("../data");
const User = require("../models/User");
const { createUserValidator, updateUserValidator, userIdValidator } = require("../validators/userValidator");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// const findUser = (req, res, next) => {
//   const user = users.find((u) => u.id === parseInt(req.params.id));
//   if (!user) return res.status(404).json({ success: false, message: "User not found" });
//   req.user = user;
//   next()
// };
const findUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  req.user = user;
  next();
};

// router.get("/", auth, (req, res) => {
//   res.json({ success: true, data: users });
// });
router.get("/", auth, authorize("admin"), async (req, res) => {
  const users = await User.find();
  res.json({ success: true, data: users });
});

router.get("/:id", auth, userIdValidator, validate, findUser, (req, res) => {
  res.json({ success: true, data: req.user });
});

// router.post("/", auth, createUserValidator, validate, (req, res) => {
//   const { name, email } = matchedData(req);
//   const newUser = { id: users.length + 1, name, email };
//   users.push(newUser);
//   res.status(201).json({ success: true, data: newUser });
// });
router.post("/", auth, authorize("admin"), createUserValidator, validate, async (req, res) => {
  const { name, email } = matchedData(req);
  const newUser = await User.create({ name, email });
  res.status(201).json({ success: true, data: newUser });
});

// router.put("/:id", auth, updateUserValidator, validate, findUser, (req, res) => {
//   const { name, email } = matchedData(req);
//   if (name) req.user.name = name;
//   if (email) req.user.email = email;
//   res.json({ success: true, data: req.user });
// });
router.put("/:id", auth, authorize("admin", "user"), updateUserValidator, validate, findUser, async (req, res) => {
  const { name, email } = matchedData(req);
  const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
  res.json({ success: true, data: updatedUser });
});

// router.delete("/:id", auth, userIdValidator, validate, findUser, (req, res) => {
//   const index = users.indexOf(req.user);
//   users.splice(index, 1);
//   res.json({ success: true, message: "User deleted" });
// });
router.delete("/:id", auth, authorize("admin"), userIdValidator, validate, findUser, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
});

module.exports = router;
