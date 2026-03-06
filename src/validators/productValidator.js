const { body, param } = require("express-validator");

const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),
];

const updateProductValidator = [
  param("id").isInt().withMessage("ID must be a number"),

  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category").optional(),
];

const productIdValidator = [
  param("id").isInt().withMessage("ID must be a number"),
];

module.exports = { createProductValidator, updateProductValidator, productIdValidator };
