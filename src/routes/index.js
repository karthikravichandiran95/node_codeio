const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/products", require("./products"));
router.use("/orders", require("./orders"));
router.use("/categories", require("./categories"));
router.use("/files", require("./files"));
router.use("/auth", require("./auth"));
router.use("/payments", require("./payments"));
router.use("/admin", require("./admin"));
router.use("/chat", require("./chat"));
router.use("/cart", require("./cart"));


module.exports = router;
