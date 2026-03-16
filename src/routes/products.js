const express = require("express");
const router = express.Router();
// const { products } = require("../data"); // V1: in-memory data
const Product = require("../models/Product");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const findProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError("Product not found", 404);
  req.product = product;
  next();
});

// GET all products
router.get("/", asyncHandler(async (req, res) => {
  let query = {};

  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }

  if (req.query.category) {
    query.category = req.query.category;
  }

  let sortOption = {};
  if (req.query.sort) {
    sortOption[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate("createdBy", "name email");

  const totalItems = await Product.countDocuments(query);

  res.json({
    success: true,
    data: products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      itemsPerPage: limit,
    },
  });
}));

// GET single product
router.get("/:id", findProduct, (req, res) => {
  res.json({ success: true, data: req.product });
});

// CREATE product (Cloudinary upload)
router.post("/", auth, authorize("admin"), upload.single("image"), asyncHandler(async (req, res) => {
  const { name, price, category, stock } = req.body;
  // console.log("req user in product route", req.user);
  

  let imageUrl = "";
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "products");
    imageUrl = result.secure_url;
  }

  const newProduct = await Product.create({
    name,
    price,
    category,
    stock,
    image: imageUrl,
    createdBy: req.user.id,
  });
  console.log("new product", newProduct);
  
  res.status(201).json({ success: true, data: newProduct });
}));

// UPDATE product (Cloudinary upload)
router.put("/:id", auth, authorize("admin"), upload.single("image"), findProduct, asyncHandler(async (req, res) => {
  const { name, price, category, stock } = req.body;
  const updateData = { name, price, category, stock };

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "products");
    updateData.image = result.secure_url;
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );
  res.json({ success: true, data: updatedProduct });
}));

// DELETE product
router.delete("/:id", auth, authorize("admin"), findProduct, asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Product deleted" });
}));

module.exports = router;
