const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
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
          const domain = parts[1].toLowerCase();
          // Student must have .edu domain (Strict check from your code)
          return domain.includes(".edu");
        },
        message: (props) =>
          `${props.value} is not a valid student email (domain must contain '.edu')`,
      },
    },

    password: {
      type: String,
      required: true,
      select: false, // Prevents sending hashed password
    },

    // ----------------------------------
    // COLLEGE INFORMATION
    // ----------------------------------
    college: {
      name: { type: String, default: "" },
      rollNumber: { type: String, default: "" },
      verified: { type: Boolean, default: false },
    },

    // ----------------------------------
    // PROFILE INFORMATION
    // ----------------------------------
    profile: {
      year: { type: Number },
      department: { type: String },
      bio: { type: String },
      interests: [{ type: String }],
      skills: [{ type: String }],
      avatarUrl: { type: String },
      coverPhotoUrl: { type: String },
    },

    // ----------------------------------
    // USER STATS
    // ----------------------------------
    stats: {
      points: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      weeklyPoints: { type: Number, default: 0 },
      badges: [{ type: String }],
    },

    // ----------------------------------
    // SOCIAL CONNECTIONS (Required for Share/Mutuals)
    // ----------------------------------
    social: {
      followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },

    // ----------------------------------
    // GROUPS & POSTS
    // ----------------------------------
    groupsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    // ----------------------------------
    // ROLE
    // ----------------------------------
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);