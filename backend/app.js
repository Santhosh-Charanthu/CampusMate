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
const http = require("http");
const initSocket = require("./src/socket/socket");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

// const initSocket = require("./src/socket/socket"); // Uncomment when file exists

const { connectDB, closeDB } = require("./src/config/db");

const User = require("./src/models/User");

// ROUTES
const authRoutes = require("./src/routes/authRoutes");
const messageRoutes = require("./src/routes/messages");
const chatRoomRoutes = require("./src/routes/chatroom");
const adminSetupRoute = require("./src/routes/adminSetup");
const postsRoute = require("./src/routes/posts");
const chatRoute = require("./src/routes/chat");

const postRoutes = require("./src/routes/postRoutes");
const userRoutes = require("./src/routes/userRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
// MIDDLEWARE
const errorHandler = require("./src/middleware/errorHandler");

/* ----------------------------------------
   GLOBAL MIDDLEWARE
---------------------------------------- */

app.use(helmet());

/* ✅ SINGLE, CORRECT CORS CONFIG */
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || true,
    credentials: true, // allow cookies / auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

// Rate Limiting
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const dbUrl = process.env.MONGO_URI;
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
   DATABASE & SERVER SETUP
---------------------------------------- */

// Use the connectDB function or this manual connection (keeping manual to match your snippet)
// mongoose
//   .connect(dbUrl)
//   .then(() => console.log("Connected to DB"))
//   .catch((err) => console.log("DB Connection Error:", err));

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// initSocket(io);

// 👇 RESTORED: Team Lead's Commented Socket Code
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
   DATABASE
---------------------------------------- */

// const dbUrl = process.env.MONGO_URI;

// mongoose
//   .connect(dbUrl)
//   .then(() => console.log("Connected to DB"))
//   .catch((err) => console.log("DB Connection Error:", err));

/* ----------------------------------------
   SERVER & SOCKET
---------------------------------------- */

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: true,
//     credentials: true,
//   },
// });

// socket code can stay commented if not used
// initSocket(io);

/* ----------------------------------------
   ROUTES
---------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/chatrooms", chatRoomRoutes);

// One-time admin setup route
app.use("/api/setup/admin", adminSetupRoute);
app.use("/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/profile", profileRoutes);

// Feature routes (namespaced to avoid duplicate handlers)
app.use("/api/posts/features", postRoutes);
app.use("/api/users/features", userRoutes);

// Main routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Chat (rooms & messages)
app.use("/api/chat", chatRoute);

// Health route
app.get("/health", (req, res) => res.json({ ok: true }));

// Global error handler
app.use(errorHandler);

/* ----------------------------------------
   SERVER START
---------------------------------------- */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening to port http://localhost:${PORT}`);
});
