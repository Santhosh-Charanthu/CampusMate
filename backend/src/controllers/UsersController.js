const mongoose = require("mongoose");
const User = require("../models/User");

module.exports.getAllUsers = async (req, res) => {
  try {
    // Find all users except yourself
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "name email"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};
