// OLD:
// const errorHandler = (err, req, res, next) => {
//   console.error(`[ERROR] ${err.message}`);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// };

// NEW: Enhanced Error Handler
const errorHandler = (err, req, res, next) => {
  // Mongoose - Invalid ObjectId (wrong ID format)
  if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose - Duplicate key (email already exists)
  if (err.code === 11000) {
    err.statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    err.message = `${field} already exists`;
  }

  // Mongoose - Validation error (required field missing)
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  // JWT - Invalid token
  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token";
  }

  // JWT - Token expired
  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message = "Token expired";
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
