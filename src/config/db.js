const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
  console.log("MONGO_URI starts with:", process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) : "UNDEFINED");
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
