// ============================================================
// OLD CODE ARCHIVE — Reference Only (Do NOT import this file)
// ============================================================
// This file contains all the old commented-out code that was
// removed during cleanup. Kept for learning reference.
// ============================================================

// ==================== PRODUCTS.JS ====================

// --- V1: In-memory data (no database) ---

// const findProduct = (req, res, next) => {
//   const product = products.find((p) => p.id === parseInt(req.params.id));
//   if (!product) return res.status(404).json({ success: false, message: "Product not found" });
//   req.product = product;
//   next();
// };

// router.get("/", (req, res) => {
//   let result = [...products];
//   // search, filter, sort, pagination - all in-memory
//   ...
// });

// router.post("/", (req, res) => {
//   const { name, price, category } = req.body;
//   const newProduct = { id: products.length + 1, name, price, category };
//   products.push(newProduct);
//   res.status(201).json({ success: true, data: newProduct });
// });

// router.put("/:id", findProduct, (req, res) => {
//   const { name, price, category } = req.body;
//   if (name) req.product.name = name;
//   if (price) req.product.price = price;
//   if (category) req.product.category = category;
//   res.json({ success: true, data: req.product });
// });

// router.delete("/:id", findProduct, (req, res) => {
//   const index = products.indexOf(req.product);
//   products.splice(index, 1);
//   res.json({ success: true, message: "Product deleted" });
// });

// --- V2: MongoDB but no error handling ---

// const findProduct = async (req, res, next) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ success: false, message: "Product not found" });
//   req.product = product;
//   next();
// };

// router.get("/", async (req, res) => {
//   const products = await Product.find(query)...
//   res.json({ success: true, data: products });
// });

// router.post("/", auth, authorize("admin"), async (req, res) => {
//   const { name, price, category, stock } = req.body;
//   const newProduct = await Product.create({
//     name, price, category, stock,
//     createdBy: req.user.id,
//   });
//   res.status(201).json({ success: true, data: newProduct });
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

// --- V3: Local file upload (diskStorage) ---

// router.post("/", auth, authorize("admin"), upload.single("image"), asyncHandler(async (req, res) => {
//   const { name, price, category, stock } = req.body;
//   const newProduct = await Product.create({
//     name, price, category, stock,
//     image: req.file ? req.file.filename : "",
//     createdBy: req.user.id,
//   });
//   res.status(201).json({ success: true, data: newProduct });
// }));

// router.put("/:id", auth, authorize("admin"), upload.single("image"), findProduct, asyncHandler(async (req, res) => {
//   const { name, price, category, stock } = req.body;
//   const updateData = { name, price, category, stock };
//   if (req.file) { updateData.image = req.file.filename; }
//   const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
//   res.json({ success: true, data: updatedProduct });
// }));


// ==================== ORDERS.JS ====================

// --- V1: In-memory data ---

// const findOrder = (req, res, next) => {
//   const order = orders.find((o) => o.id === parseInt(req.params.id));
//   if (!order) return res.status(404).json({ success: false, message: "Order not found" });
//   req.order = order;
//   next();
// };


// ==================== CATEGORIES.JS ====================

// --- V1: In-memory data ---

// const findCategory = (req, res, next) => {
//   const category = categories.find((c) => c.id === parseInt(req.params.id));
//   if (!category) return res.status(404).json({ success: false, message: "Category not found" });
//   req.category = category;
//   next();
// };


// ==================== USERS.JS ====================

// --- V1: In-memory data ---

// const findUser = (req, res, next) => {
//   const user = users.find((u) => u.id === parseInt(req.params.id));
//   if (!user) return res.status(404).json({ success: false, message: "User not found" });
//   req.user = user;
//   next();
// };


// ==================== AUTH.JS ====================

// --- Old signup without error handling ---
// router.post("/signup", async (req, res) => { ... no error handling });


// ==================== UPLOAD.JS (Middleware) ====================

// --- V1: diskStorage (local file save) ---

// const storage = multer.diskStorage({
//   destination: "assets/uploads",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
