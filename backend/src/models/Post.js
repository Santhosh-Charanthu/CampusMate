const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  type: {
    type: String,
    enum: ["text", "image", "video"],
    default: "text",
  },

  caption: String,
  mediaUrls: [String],
  thumbnailUrl: String,

  visibility: {
    type: String,
    enum: ["public", "private", "group", "friends"],
    default: "public",
  },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
