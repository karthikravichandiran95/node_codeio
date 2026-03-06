const { body, param } = require("express-validator");

const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters"),

  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Description must be under 200 characters"),
];

const updateCategoryValidator = [
  param("id").isInt().withMessage("ID must be a number"),

  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters"),

  body("description")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Description must be under 200 characters"),
];

const categoryIdValidator = [
  param("id").isInt().withMessage("ID must be a number"),
];

module.exports = { createCategoryValidator, updateCategoryValidator, categoryIdValidator };
