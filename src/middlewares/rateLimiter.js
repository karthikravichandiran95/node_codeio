const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 45 * 60 * 1000,   // 45 minutes
  max: 45,                     // 45 requests per 45 minutes
  message: {
    success: false,
    message: "Too many requests, please try again after 45 minutes",
  },
});

module.exports = limiter;
