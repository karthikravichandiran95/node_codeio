const { body, param } = require("express-validator");

const createOrderValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt()
    .withMessage("User ID must be a number"),

  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isInt()
    .withMessage("Product ID must be a number"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const updateOrderValidator = [
  param("id").isInt().withMessage("ID must be a number"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled"])
    .withMessage("Invalid status value"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

const orderIdValidator = [
  param("id").isInt().withMessage("ID must be a number"),
];

module.exports = { createOrderValidator, updateOrderValidator, orderIdValidator };
