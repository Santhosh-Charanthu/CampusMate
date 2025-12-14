const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String, // academic / club / interest / project

  type: { type: String, enum: ["public", "private"], default: "public" },

  coverImage: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Group", GroupSchema);
