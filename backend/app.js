// backend/app.js
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log(
  "DEBUG: ADMIN_SECRET=",
  process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.length
    ? "***set***"
    : "***NOT SET***"
);

const express = require("express");
const app = express();
const PORT = process.env.PORT;
const http = require("http");
const initSocket = require("./src/socket/socket");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");

const { connectDB, closeDB } = require("./src/config/db");

const User = require("./src/models/User");

// ROUTES
const authRoutes = require("./src/routes/authRoutes");
const messageRoutes = require("./src/routes/messages");
const chatRoomRoutes = require("./src/routes/chatroom");
const adminSetupRoute = require("./src/routes/adminSetup");
const userRoutes = require("./src/routes/UserRoutes");

// MIDDLEWARE
const errorHandler = require("./src/middleware/errorHandler");

/* ----------------------------------------
   GLOBAL MIDDLEWARE
---------------------------------------- */

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || true, // <-- Adjust in production
    credentials: true,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 🔥 must match socket.io
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Basic Rate Limiting
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

dbUrl = process.env.MONGO_URI;

mongoose
  .connect(dbUrl)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // RECOVERY LOGIC: Mark all users as offline on startup
    // This cleans up "ghost" online statuses from a previous crash
    try {
      await User.updateMany({}, { isOnline: false });
      console.log("🔄 Reset all user statuses to offline for safety.");
    } catch (err) {
      console.error("❌ Failed to reset user statuses:", err);
    }
  })
  .catch((err) => console.log("DB Connection Error:", err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);

// io.on("connection", (socket) => {
//   console.log("Socket connected:", socket.id);

//   socket.on("join_room", (roomId) => {
//     socket.join(roomId);
//     console.log(`🟢 ${socket.id} joined room ${roomId}`);
//   });

//   socket.on("send_message", ({ roomId, text, senderId }) => {
//     console.log(`📨 ${senderId}: ${text}`);

//     io.to(roomId).emit("receive_message", {
//       text,
//       senderId,
//     });
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

/* ----------------------------------------
   ROUTES
---------------------------------------- */

// Auth routes (Register + Login)
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/chatrooms", chatRoomRoutes);

// One-time admin setup route
app.use("/api/setup/admin", adminSetupRoute);

// Global error handler (should be last route)
app.use(errorHandler);

/* ----------------------------------------
   SERVER START + GRACEFUL SHUTDOWN
---------------------------------------- */

server.listen(PORT, () => {
  console.log(`Listening to port http://localhost:${PORT}`);
});
