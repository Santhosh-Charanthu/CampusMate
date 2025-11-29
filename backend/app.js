// backend/app.js
require("dotenv").config();
console.log('DEBUG: ADMIN_SECRET=', process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.length ? '***set***' : '***NOT SET***');

const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const { connectDB, closeDB } = require("./src/config/db");

// ROUTES
const authRoutes = require("./src/routes/authRoutes");
const adminSetupRoute = require("./src/routes/adminSetup");

// MIDDLEWARE
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

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

/* ----------------------------------------
   ROUTES
---------------------------------------- */

// Auth routes (Register + Login)
app.use("/api/auth", authRoutes);

// One-time admin setup route
app.use("/api/setup/admin", adminSetupRoute);

// Health route
app.get("/health", (req, res) => res.json({ ok: true }));

// Global error handler (should be last route)
app.use(errorHandler);

/* ----------------------------------------
   SERVER START + GRACEFUL SHUTDOWN
---------------------------------------- */

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Shutting down...`);
      server.close(async (err) => {
        if (err) {
          console.error("Error while closing server:", err);
          process.exit(1);
        }
        await closeDB();
        console.log("Shutdown complete.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGHUP", () => shutdown("SIGHUP"));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
