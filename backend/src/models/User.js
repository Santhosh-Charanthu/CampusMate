const mongoose = require("mongoose");

/**
 * User Schema - Student Profile Model
 * Contains all student profile information, stats, and social connections
 */
const UserSchema = new mongoose.Schema(
  {
    // ----------------------------------
    // AUTHENTICATION & BASIC INFO
    // ----------------------------------
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return false;
          const parts = v.split("@");
          if (parts.length !== 2) return false;
          const domain = parts[1] ? parts[1].toLowerCase() : "";
          return domain.includes(".edu"); // student must have .edu domain
        },
        message: (props) =>
          `${props.value} is not a valid student email (domain must contain '.edu')`,
      },
    },

    password: {
      type: String,
      required: true,
      select: false, // important: prevents sending hashed password
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores"],
    },

    // ----------------------------------
    // COLLEGE INFORMATION
    // ----------------------------------
    college: {
      name: { 
        type: String, 
        required: true,
        trim: true,
      },
      rollNumber: { 
        type: String, 
        default: "",
        trim: true,
      },
      verified: { 
        type: Boolean, 
        default: false 
      },
      verificationDocument: {
        type: String, // URL to verification document
        default: "",
      },
    },

    // ----------------------------------
    // PROFILE INFORMATION
    // ----------------------------------
    profile: {
      year: { 
        type: Number, 
        min: 1,
        max: 10,
      },
      department: { 
        type: String,
        trim: true,
      },
      bio: { 
        type: String,
        maxlength: 500,
        trim: true,
      },
      interests: [{ 
        type: String,
        trim: true,
      }],
      skills: [{ 
        type: String,
        trim: true,
      }],
      avatarUrl: { 
        type: String,
        default: "",
      },
      coverPhotoUrl: { 
        type: String,
        default: "",
      },
      location: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
    },

    // ----------------------------------
    // USER STATS & GAMIFICATION
    // ----------------------------------
    stats: {
      points: { 
        type: Number, 
        default: 0,
        min: 0,
      },
      streak: { 
        type: Number, 
        default: 0,
        min: 0,
      },
      weeklyPoints: { 
        type: Number, 
        default: 0,
        min: 0,
      },
      totalPosts: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalReels: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalGroupsJoined: {
        type: Number,
        default: 0,
        min: 0,
      },
      badges: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Badge" 
      }],
      lastActiveDate: {
        type: Date,
        default: Date.now,
      },
    },

    // ----------------------------------
    // SOCIAL CONNECTIONS
    // ----------------------------------
    social: {
      followers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }],
      following: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }],
      friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "FriendRequest",
      }],
    },

    // ----------------------------------
    // GROUPS & POSTS
    // ----------------------------------
    groupsJoined: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Group" 
    }],

    groupsCreated: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    }],

    savedPosts: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Post" 
    }],

    // ----------------------------------
    // PRIVACY SETTINGS
    // ----------------------------------
    privacy: {
      profileVisibility: {
        type: String,
        enum: ["public", "friends", "private"],
        default: "public",
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showRollNumber: {
        type: Boolean,
        default: true,
      },
    },

    // ----------------------------------
    // ROLE & STATUS
    // ----------------------------------
    role: {
      type: String,
      enum: ["student", "admin", "moderator"],
      default: "student",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // ----------------------------------
    // ACCOUNT SETTINGS
    // ----------------------------------
    settings: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ "college.name": 1 });
UserSchema.index({ "stats.weeklyPoints": -1 }); // For leaderboard queries
UserSchema.index({ "stats.points": -1 });

// Hide password in responses
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
