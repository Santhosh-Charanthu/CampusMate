const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: String,
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", ReportSchema);
