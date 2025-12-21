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

    // ----------------------------------
    // CONTENT
    // ----------------------------------
    caption: {
      type: String,
      maxlength: 2200,
      trim: true,
    },

    mediaUrls: [
      {
        type: String, // image or video URLs
        required: true,
      },
    ],

    thumbnailUrl: {
      type: String, // For reels preview
    },

    // Media metadata
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    duration: {
      type: Number, // For videos/reels in seconds
      min: 0,
    },

    // ----------------------------------
    // VISIBILITY & TARGETING
    // ----------------------------------
    visibility: {
      type: String,
      enum: ["public", "friends", "group"],
      default: "public",
      required: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      index: true,
    },

    // Post category/tags
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    category: {
      type: String,
      enum: [
        "general",
        "academic",
        "event",
        "doubt",
        "solution",
        "notes",
        "resource",
        "announcement",
      ],
      default: "general",
    },

    // ----------------------------------
    // ENGAGEMENT METRICS
    // ----------------------------------
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    shares: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ----------------------------------
    // COMMENTS & INTERACTIONS
    // ----------------------------------
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ----------------------------------
    // MODERATION
    // ----------------------------------
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
      },
    ],

    reportCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },

    // ----------------------------------
    // FEATURED & PROMOTION
    // ----------------------------------
    isFeatured: {
      type: Boolean,
      default: false,
    },

    featuredUntil: {
      type: Date,
    },

    // ----------------------------------
    // LOCATION (Optional)
    // ----------------------------------
    location: {
      name: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Reference to comments
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],

    createdAt: { type: Date, default: Date.now },
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
