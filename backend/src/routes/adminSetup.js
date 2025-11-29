// backend/src/routes/adminSetup.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * POST /
 * Protected by ADMIN_SECRET (in .env) which must be provided either in:
 *   - header "x-admin-secret": <ADMIN_SECRET>
 *   - or body.adminSecret: <ADMIN_SECRET>
 *
 * Body: { name, email, password, collegeName?, rollNumber? }
 *
 * NOTE:
 * - This route is intended as a one-time helper to create your first admin.
 * - Remove or disable the route after creating the admin for safety.
 */
router.post("/", async (req, res, next) => {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return res
        .status(403)
        .json({ message: "Admin setup disabled (ADMIN_SECRET not set)" });
    }

    const providedSecret = req.headers["x-admin-secret"] || req.body.adminSecret;
    if (!providedSecret || providedSecret !== adminSecret) {
      return res.status(403).json({ message: "Invalid admin setup secret" });
    }

    const { name, email, password, collegeName, rollNumber } = req.body || {};
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    // Prevent creating duplicate users
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "User with that email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const adminUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: "admin",
      college: { name: collegeName || "", rollNumber: rollNumber || "" },
    });

    // Save normally — this will run model validators (including your '.edu' validator).
    // If you want admins to be allowed non-`.edu` emails, change the save call to:
    //    await adminUser.save({ validateBeforeSave: false });
    // but only do that if you're sure you want to bypass model validation.
    await adminUser.save();

    const userObj = adminUser.toObject ? adminUser.toObject() : adminUser;
    delete userObj.password;

    return res.status(201).json({ message: "Admin created", user: userObj });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      const first = Object.values(err.errors)[0];
      return res.status(400).json({ message: first.message || "Validation error" });
    }
    next(err);
  }
});

module.exports = router;
