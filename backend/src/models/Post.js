const mongoose = require("mongoose");

/**
 * Post Schema - Posts & Reels Model
 * Handles both regular posts and short video reels
 */
const PostSchema = new mongoose.Schema(
  {
    // ----------------------------------
    // OWNERSHIP & TYPE
    // ----------------------------------
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["post", "reel"],
      default: "post",
      required: true,
    },

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

  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Indexes for better query performance
PostSchema.index({ owner: 1, createdAt: -1 });
PostSchema.index({ groupId: 1, createdAt: -1 });
PostSchema.index({ type: 1, createdAt: -1 });
PostSchema.index({ visibility: 1, createdAt: -1 });
PostSchema.index({ category: 1 });
PostSchema.index({ isFeatured: 1, createdAt: -1 });
PostSchema.index({ likes: 1 });

module.exports = mongoose.model("Post", PostSchema);
