const express = require("express");
const router = express.Router();
// const { categories } = require("../data");
const Category = require("../models/Category");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// const findCategory = (req, res, next) => {
//   const category = categories.find((c) => c.id === parseInt(req.params.id));
//   if (!category) return res.status(404).json({ success: false, message: "Category not found" });
//   req.category = category;
//   next();
// };
const findCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: "Category not found" });
  req.category = category;
  next();
};

// GET all categories - public
// router.get("/", (req, res) => {
//   res.json({ success: true, data: categories });
// });
router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json({ success: true, data: categories });
});

// GET single category - public
// router.get("/:id", findCategory, (req, res) => {
//   res.json({ success: true, data: req.category });
// });
router.get("/:id", findCategory, (req, res) => {
  res.json({ success: true, data: req.category });
});

// CREATE category - admin only
// router.post("/", (req, res) => {
//   const { name, description } = req.body;
//   const newCategory = { id: categories.length + 1, name, description: description || "" };
//   categories.push(newCategory);
//   res.status(201).json({ success: true, data: newCategory });
// });
router.post("/", auth, authorize("admin"), async (req, res) => {
  const { name, description } = req.body;
  const newCategory = await Category.create({ name, description });
  res.status(201).json({ success: true, data: newCategory });
});

// UPDATE category - admin only
// router.put("/:id", findCategory, (req, res) => {
//   const { name, description } = req.body;
//   if (name) req.category.name = name;
//   if (description) req.category.description = description;
//   res.json({ success: true, data: req.category });
// });
router.put("/:id", auth, authorize("admin"), findCategory, async (req, res) => {
  const { name, description } = req.body;
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    { name, description },
    { new: true }
  );
  res.json({ success: true, data: updatedCategory });
});

// DELETE category - admin only
// router.delete("/:id", findCategory, (req, res) => {
//   const index = categories.indexOf(req.category);
//   categories.splice(index, 1);
//   res.json({ success: true, message: "Category deleted" });
// });
router.delete("/:id", auth, authorize("admin"), findCategory, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Category deleted" });
});

module.exports = router;
