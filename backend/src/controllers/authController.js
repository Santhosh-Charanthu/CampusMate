// backend/src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Read JWT secret and expiry from env
const JWT_SECRET = process.env.JWT_SECRET || "change_this_in_prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// tiny helper to create JWT
function createToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role || "student" },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * POST /api/auth/register
 * Body: { name, email, password, college? }
 */ exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      collegeName,
      rollNumber,
      year,
      department,
      bio,
      interests,
      skills,
    } = req.body || {};

    /* ---------------- BASIC VALIDATIONS ---------------- */
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }

    /* ---------------- CHECK EXISTING USER ---------------- */
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    /* ---------------- HASH PASSWORD ---------------- */
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    /* ---------------- INTERESTS & SKILLS ---------------- */
    const interestsArr = interests
      ? Array.isArray(interests)
        ? interests
        : [interests]
      : [];

    const skillsArr = skills ? (Array.isArray(skills) ? skills : [skills]) : [];

    /* ---------------- AVATAR UPLOAD (CLOUDINARY) ---------------- */
    let avatarUrl = "";

    if (req.files?.avatar?.[0]) {
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "campusconnect/avatars",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(req.files.avatar[0].buffer).pipe(stream);
        });

      const result = await uploadFromBuffer();
      avatarUrl = result.secure_url;
    }

    /* ---------------- CREATE USER ---------------- */
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,

      college: {
        name: collegeName || "",
        rollNumber: rollNumber || "",
        verified: false,
      },

      profile: {
        year: parseInt(year) || undefined,
        department: department || "",
        bio: bio || "",
        interests: interestsArr,
        skills: skillsArr,
        avatarUrl, // ✅ Cloudinary URL
      },

      role: "student",
    });

    await user.save();

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Registered successfully!",
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    if (err?.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0];
      return res.status(400).json({ message: firstError.message });
    }
    next(err);
  }
};
/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    // password field on model is stored select: false, so explicitly select it
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    // remove password before returning
    const userObj = user.toObject ? user.toObject() : Object.assign({}, user);
    delete userObj.password;

    return res.json({
      message: "Login successful",
      user: userObj,
      token,
    });
  } catch (err) {
    next(err);
  }
};
