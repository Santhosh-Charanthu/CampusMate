"use client";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

// Internal Imports
const initSocket = require("./src/socket/socket");
const User = require("./src/models/User");
const errorHandler = require("./src/middleware/errorHandler");

// Route Imports (Cleaned up duplicates)
const authRoutes = require("./src/routes/authRoutes");
const messageRoutes = require("./src/routes/messages");
const chatRoomRoutes = require("./src/routes/chatroom");
const adminSetupRoute = require("./src/routes/adminSetup");
const postRoutes = require("./src/routes/postRoutes");
const userRoutes = require("./src/routes/userRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const chatRoute = require("./src/routes/chat");

const app = express();
const server = http.createServer(app);

/* ----------------------------------------
   GLOBAL MIDDLEWARE
---------------------------------------- */
app.use(helmet());

// Optimized CORS (Only need one instance)
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_ORIGIN].filter(
      Boolean
    ),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ----------------------------------------
   DATABASE CONNECTION
---------------------------------------- */
const dbUrl = process.env.MONGO_URI;
mongoose
  .connect(dbUrl)
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    try {
      // Mark all users offline on startup to prevent "ghost" statuses
      await User.updateMany({}, { isOnline: false });
      console.log("🔄 Reset all user statuses to offline.");
    } catch (err) {
      console.error("❌ Status reset failed:", err);
    }
  })
  .catch((err) => console.log("DB Connection Error:", err));

/* ----------------------------------------
   SOCKET.IO SETUP
---------------------------------------- */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);

/* ----------------------------------------
   ROUTES (Aligned & Organized)
---------------------------------------- */

// Authentication & Users
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

// Content & Features
app.use("/api/posts", postRoutes);

// Chat & Messaging
app.use("/api/messages", messageRoutes);
app.use("/api/chatrooms", chatRoomRoutes);
app.use("/api/chat", chatRoute);

// System/Admin
app.use("/api/setup/admin", adminSetupRoute);
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

// Global error handler (MUST be last)
app.use(errorHandler);

/* ----------------------------------------
   SERVER START
---------------------------------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
