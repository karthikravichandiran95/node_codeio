const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middlewares/upload");

// POST /api/files/upload
router.post("/upload", upload.single("image"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  res.status(201).json({
    success: true,
    file: req.file,
  });
});

// GET /api/files/:filename
router.get("/:filename", (req, res) => {
  const filePath = path.join(__dirname, "../../assets", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  res.sendFile(filePath);
});

module.exports = router;
