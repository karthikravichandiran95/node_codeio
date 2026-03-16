const express = require("express");
const router = express.Router();
// const { categories } = require("../data"); // V1: in-memory data
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const findCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new AppError("Category not found", 404);
  req.category = category;
  next();
});

// GET all categories - public
router.get("/", asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json({ success: true, data: categories });
}));

// GET single category - public
router.get("/:id", findCategory, (req, res) => {
  res.json({ success: true, data: req.category });
});

// CREATE category - admin only
router.post("/", auth, authorize("admin"), asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const newCategory = await Category.create({ name, description });
  res.status(201).json({ success: true, data: newCategory });
}));

// UPDATE category - admin only
router.put("/:id", auth, authorize("admin"), findCategory, asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );
  res.json({ success: true, data: updatedCategory });
}));

// DELETE category - admin only
router.delete("/:id", auth, authorize("admin"), findCategory, asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Category deleted" });
}));

module.exports = router;
