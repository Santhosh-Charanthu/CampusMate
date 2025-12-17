const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  points: { type: Number, default: 0 },
  action: { type: String }, // upload_notes, solve_doubt, post, etc.
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", ActivitySchema);
