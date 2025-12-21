const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  type: { type: String, enum: ["post", "reel", "text"], default: "post" }, // Added 'text' for your test

  caption: String,
  mediaUrls: [String],
  thumbnailUrl: String,

  visibility: {
    type: String,
    enum: ["public", "friends", "group"],
    default: "public",
  },
  
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // Reference to comments
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
