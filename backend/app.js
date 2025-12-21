require("dotenv").config();

console.log(
  "DEBUG: ADMIN_SECRET=",
  process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.length
    ? "***set***"
    : "***NOT SET***"
);

const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

// ROUTES
const authRoutes = require("./src/routes/authRoutes");
const adminSetupRoute = require("./src/routes/adminSetup");
const postRoutes = require("./src/routes/postRoutes");
const userRoutes = require("./src/routes/userRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
// MIDDLEWARE
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

/* ----------------------------------------
   GLOBAL MIDDLEWARE
---------------------------------------- */

app.use(helmet());

/* ✅ SINGLE, CORRECT CORS CONFIG */
app.use(
  cors({
    origin: true, // allow all origins (Postman Web + frontend)
    credentials: true, // allow cookies / auth headers
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
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* ----------------------------------------
   DATABASE
---------------------------------------- */

const dbUrl = process.env.MONGO_URI;

mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB Connection Error:", err));

/* ----------------------------------------
   SERVER & SOCKET
---------------------------------------- */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// socket code can stay commented if not used
// initSocket(io);

/* ----------------------------------------
   ROUTES
---------------------------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/setup/admin", adminSetupRoute);
app.use("/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/profile", profileRoutes);

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Global error handler (must be last)
app.use(errorHandler);

/* ----------------------------------------
   START SERVER
---------------------------------------- */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
