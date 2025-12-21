const jwt = require("jsonwebtoken");
const User = require("../models/User");

const socketAuth = async (socket, next) => {
  try {
    console.log("🔐 Socket auth middleware triggered");

    const token = socket.handshake.auth?.token;
    console.log("🧾 Token received:", token);

    if (!token) {
      console.log("❌ No token in socket handshake");
      return next(new Error("Authentication error: No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    const user = await User.findById(decoded.id);
    console.log("👤 User found:", user?._id);

    if (!user) {
      console.log("❌ User not found");
      return next(new Error("User not found"));
    }

    socket.user = {
      id: user._id.toString(),
      name: user.name,
    };

    console.log("🎉 Socket auth success");
    next();
  } catch (err) {
    console.error("❌ Socket auth failed:", err.message);
    next(new Error("Socket authentication failed"));
  }
};

module.exports = socketAuth;
