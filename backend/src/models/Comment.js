const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  text: { type: String, required: true },

  // Self-referencing for nested replies (optional, but good for "Reply" feature)
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
