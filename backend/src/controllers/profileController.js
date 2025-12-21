const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const User = require("../models/User");
const Post = require("../models/Post");

const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  const parts = url.split("/");
  const fileName = parts.pop(); // abc123.jpg
  const folderPath = parts.slice(parts.indexOf("upload") + 1).join("/");

  const publicId = folderPath.replace("/v" + folderPath.split("/")[0], "")
    ? folderPath.split("/").slice(1).join("/") + "/" + fileName.split(".")[0]
    : folderPath + "/" + fileName.split(".")[0];

  return publicId;
};

/**
 * ============================
 * GET MY PROFILE
 * ============================
 */
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "savedPosts",
        options: { sort: { createdAt: -1 } },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        collegeName: user.college.name,
        avatarUrl: user.profile.avatarUrl,
        bio: user.profile.bio,
        interests: user.profile.interests,
        skills: user.profile.skills,

        followersCount: user.social.followers.length,
        followingCount: user.social.following.length,

        streak: user.stats.streak,
        points: user.stats.points,
        badges: user.stats.badges,

        posts: user.posts,
        savedPosts: user.savedPosts,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.editMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { name, collegeName, bio, interests, skills } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🧾 Update text fields
    if (name !== undefined) user.name = name;
    if (collegeName !== undefined) user.college.name = collegeName;
    if (bio !== undefined) user.profile.bio = bio;
    if (interests !== undefined) user.profile.interests = interests;
    if (skills !== undefined) user.profile.skills = skills;

    // 🖼️ Avatar upload (DELETE OLD → UPLOAD NEW)
    if (req.file) {
      // 🔥 Delete old avatar from Cloudinary
      if (user.profile.avatarUrl) {
        const oldPublicId = getPublicIdFromUrl(user.profile.avatarUrl);
        if (oldPublicId) {
          try {
            await cloudinary.uploader.destroy(oldPublicId);
          } catch (err) {
            console.warn("Old avatar delete failed:", err.message);
          }
        }
      }

      // ⬆️ Upload new avatar
      const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "campusconnect/avatars",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await uploadFromBuffer();
      user.profile.avatarUrl = result.secure_url;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        name: user.name,
        collegeName: user.college.name,
        avatarUrl: user.profile.avatarUrl,
        bio: user.profile.bio,
        interests: user.profile.interests,
        skills: user.profile.skills,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("posts");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 Optional safety: prevent admin deletion
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin profile cannot be deleted",
      });
    }

    // 🖼️ DELETE AVATAR FROM CLOUDINARY
    if (user.profile.avatarUrl) {
      const avatarPublicId = getPublicIdFromUrl(user.profile.avatarUrl);
      if (avatarPublicId) {
        try {
          await cloudinary.uploader.destroy(avatarPublicId);
        } catch (e) {
          console.warn("Avatar delete failed:", e.message);
        }
      }
    }

    // 🗑️ DELETE ALL POSTS + POST MEDIA
    for (const post of user.posts) {
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        for (const url of post.mediaUrls) {
          const mediaPublicId = getPublicIdFromUrl(url);
          if (mediaPublicId) {
            try {
              await cloudinary.uploader.destroy(mediaPublicId);
            } catch (e) {
              console.warn("Post media delete failed:", e.message);
            }
          }
        }
      }
    }

    // ❌ DELETE POSTS FROM DB
    await Post.deleteMany({ owner: userId });

    // 🔗 REMOVE USER FROM FOLLOWERS / FOLLOWING
    await User.updateMany(
      { "social.followers": userId },
      { $pull: { "social.followers": userId } }
    );

    await User.updateMany(
      { "social.following": userId },
      { $pull: { "social.following": userId } }
    );

    // ❌ DELETE USER
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * ============================
 * GET OTHER USER PROFILE
 * ============================
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "posts",
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        collegeName: user.college.name,
        avatarUrl: user.profile.avatarUrl,
        bio: user.profile.bio,
        interests: user.profile.interests,
        skills: user.profile.skills,

        followersCount: user.social.followers.length,
        followingCount: user.social.following.length,

        streak: user.stats.streak,
        points: user.stats.points,
        badges: user.stats.badges,

        posts: user.posts,
      },
    });
  } catch (err) {
    next(err);
  }
};
