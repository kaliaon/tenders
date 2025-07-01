require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const { syncDatabase } = require("./models");
const errorHandler = require("./middleware/error.middleware");

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const tenderRoutes = require("./routes/tender.routes");

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database and sync models
const initializeDatabase = async () => {
  try {
    // Connect to PostgreSQL
    await connectDB();

    // Sync models with database
    // Set force: true only in development and when you want to rebuild the schema
    const forceSync =
      process.env.NODE_ENV === "development" &&
      process.env.DB_FORCE_SYNC === "true";
    await syncDatabase(forceSync);

    // Start server after database is ready
    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[DEBUG] Request received: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes - make sure auth routes are mounted before any protection middleware
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tenders", tenderRoutes);

// Basic route for API info
app.get("/", (req, res) => {
  res.json({
    name: "Tenders API",
    version: "1.0.0",
    description: "API for tender management system",
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Initialize the database and start the server
initializeDatabase();
