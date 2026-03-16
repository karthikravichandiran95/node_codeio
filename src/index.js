require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");
const limiter = require("./middlewares/rateLimiter");
const routes = require("./routes");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.static("assets"));
// app.use(limiter);
app.use(logger);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Node CodeIO API" });
});

// Routes
app.use("/api", routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    const { networkInterfaces } = require("os");
    const nets = networkInterfaces();
    const localIP = Object.values(nets).flat().find(
      (i) => i.family === "IPv4" && !i.internal
    )?.address || "localhost";
    console.log(`Server running on http://${localIP}:${PORT}`);
  });
});
