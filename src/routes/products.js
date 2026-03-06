const express = require("express");
const router = express.Router();
// const { products } = require("../data");
const Product = require("../models/Product");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload");

// const findProduct = (req, res, next) => {
//   const product = products.find((p) => p.id === parseInt(req.params.id));
//   if (!product) return res.status(404).json({ success: false, message: "Product not found" });
//   req.product = product;
//   next();
// };
const findProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  req.product = product;
  next();
};

// router.get("/", (req, res) => {
//   let result = [...products];
//   // search, filter, sort, pagination - all in-memory
//   ...
// });
router.get("/", async (req, res) => {
  let query = {};

  // 1. Search - ?search=iphone
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }

  // 2. Filter - ?category=mobile
  if (req.query.category) {
    query.category = req.query.category;
  }

  // 3. Sort - ?sort=price&order=asc
  let sortOption = {};
  if (req.query.sort) {
    sortOption[req.query.sort] = req.query.order === "desc" ? -1 : 1;
  }

  // 4. Pagination - ?page=1&limit=5
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
});

// router.get("/:id", findProduct, (req, res) => {
//   res.json({ success: true, data: req.product });
// });
router.get("/:id", findProduct, (req, res) => {
  res.json({ success: true, data: req.product });
});

// router.post("/", (req, res) => {
//   const { name, price, category } = req.body;
//   const newProduct = { id: products.length + 1, name, price, category };
//   products.push(newProduct);
//   res.status(201).json({ success: true, data: newProduct });
// });
// router.post("/", auth, authorize("admin"), async (req, res) => {
//   const { name, price, category, stock } = req.body;
//   const newProduct = await Product.create({
//     name,
//     price,
//     category,
//     stock,
//     createdBy: req.user.id,
//   });
//   res.status(201).json({ success: true, data: newProduct });
// });
router.post("/", auth, authorize("admin"), upload.single("image"), async (req, res) => {
  const { name, price, category, stock } = req.body;
  const newProduct = await Product.create({
    name,
    price,
    category,
    stock,
    image: req.file ? req.file.filename : "",
    createdBy: req.user.id,
  });
  res.status(201).json({ success: true, data: newProduct });
});

// router.put("/:id", findProduct, (req, res) => {
//   const { name, price, category } = req.body;
//   if (name) req.product.name = name;
//   if (price) req.product.price = price;
//   if (category) req.product.category = category;
//   res.json({ success: true, data: req.product });
// });
// router.put("/:id", auth, authorize("admin"), findProduct, async (req, res) => {
//   const { name, price, category, stock } = req.body;
//   const updatedProduct = await Product.findByIdAndUpdate(
//     req.params.id,
//     { name, price, category, stock },
//     { new: true }
//   );
//   res.json({ success: true, data: updatedProduct });
// });
router.put("/:id", auth, authorize("admin"), upload.single("image"), findProduct, async (req, res) => {
  const { name, price, category, stock } = req.body;
  const updateData = { name, price, category, stock };
  if (req.file) {
    updateData.image = req.file.filename;
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );
  res.json({ success: true, data: updatedProduct });
});

// router.delete("/:id", findProduct, (req, res) => {
//   const index = products.indexOf(req.product);
//   products.splice(index, 1);
//   res.json({ success: true, message: "Product deleted" });
// });
router.delete("/:id", auth, authorize("admin"), findProduct, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Product deleted" });
});

module.exports = router;
