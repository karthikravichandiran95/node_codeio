const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // 1. Header la token irukka?
  const token = req.headers.authorization?.split(" ")[1];;
  if (!token) {
    return res.status(401).json({ success: false, message: "Token required" });
  }

  try {
    // 2. Token valid ah?
    const decoded = jwt.verify(token, process.env.API_SECRET);
    // 3. User info req la attach
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = auth;
