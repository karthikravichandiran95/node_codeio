const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");

// OLD: sync function
// NEW: async — because DB la blacklist check pananum
const auth = async (req, res, next) => {
  // 1. Header la token irukka?
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Token required" });
  }
  console.log("aceess token", token);
  

  try {
    // 2. Token blacklisted ah? (logout pannirukkaangala?)
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: "Token has been logged out" });
    }

    // 3. Token valid ah?
    const decoded = jwt.verify(token, process.env.API_SECRET);
    // 4. User info req la attach
    req.user = decoded;
    console.log("req user", req.user);
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = auth;
