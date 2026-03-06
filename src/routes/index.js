const express = require("express");
const router = express.Router();

router.use("/users", require("./users"));
router.use("/products", require("./products"));
router.use("/orders", require("./orders"));
router.use("/categories", require("./categories"));
router.use("/files", require("./files"));
router.use("/auth", require("./auth"));
router.use("/payments", require("./payments"));

module.exports = router;
