const { body, param } = require("express-validator");

const createUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
];

const updateUserValidator = [
  // param("id").isInt().withMessage("ID must be a number"),
  param("id").isMongoId().withMessage("Invalid ID format"),

  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").optional().isEmail().withMessage("Invalid email format"),
];

const userIdValidator = [
  // param("id").isInt().withMessage("ID must be a number"),
  param("id").isMongoId().withMessage("Invalid ID format"),
];

module.exports = { createUserValidator, updateUserValidator, userIdValidator };
