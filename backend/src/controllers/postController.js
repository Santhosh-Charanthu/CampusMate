// const Post = require("../models/Post");
// const User = require("../models/User"); // Un-comment if needed later

/*
 * CREATE A NEW POST (Text only for now)
 * POST /api/posts
 */

const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
exports.createPost = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { userId } = req.params;
    const { caption, visibility = "public", groupId = null } = req.body || {};

    // 🔐 Security check
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    // 🧾 Validations
    if (!caption || caption.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Caption is required",
      });
    }

    const allowedVisibility = ["public", "private", "group"];
    if (!allowedVisibility.includes(visibility)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visibility option",
      });
    }

    if (visibility === "group" && !groupId) {
      return res.status(400).json({
        success: false,
        message: "groupId is required for group posts",
      });
    }

    let mediaUrls = [];
    let type = "text";

    // 📸 Media upload
    if (req.files && req.files.length > 0) {
      const firstFile = req.files[0];

      if (firstFile.mimetype.startsWith("video")) {
        type = "video";
      } else if (firstFile.mimetype.startsWith("image")) {
        type = "image";
      }

      for (const file of req.files) {
        const uploadFromBuffer = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "campusconnect/posts",
                resource_type: "auto",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
          });

        const result = await uploadFromBuffer();
        mediaUrls.push(result.secure_url);
      }
    }

    const newPost = new Post({
      owner: req.user._id,
      caption,
      mediaUrls,
      visibility,
      groupId,
      type, // ✅ now valid enum value
    });

    await newPost.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: newPost._id },
    });

    await newPost.populate("owner", "name profile.avatarUrl");

    return res.status(201).json({
      success: true,
      userId: req.user._id,
      postId: newPost._id,
      post: newPost,
    });
  } catch (err) {
    next(err);
  }
};

exports.editPost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { caption, visibility, removeMedia = [] } = req.body || {};

    // 🔍 Find post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // 🔐 Only owner can edit
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can edit only your post",
      });
    }

    // 🧾 Update caption
    if (caption !== undefined) {
      post.caption = caption;
    }

    // 🧾 Update visibility
    if (visibility) {
      const allowedVisibility = ["public", "private", "group", "friends"];
      if (!allowedVisibility.includes(visibility)) {
        return res.status(400).json({
          success: false,
          message: "Invalid visibility option",
        });
      }
      post.visibility = visibility;
    }

    // 🗑️ Remove selected media
    let removeList = removeMedia;
    if (typeof removeMedia === "string") {
      removeList = [removeMedia];
    }

    if (removeList.length > 0) {
      post.mediaUrls = post.mediaUrls.filter(
        (url) => !removeList.includes(url)
      );
    }

    // 📸 Upload new media
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadFromBuffer = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "campusconnect/posts",
                resource_type: "auto",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          });

        const result = await uploadFromBuffer();
        post.mediaUrls.push(result.secure_url);
      }
    }

    // 🔄 Update post type
    post.type = post.mediaUrls.length > 0 ? "media" : "text";

    await post.save();
    await post.populate("owner", "name profile.avatarUrl");

    return res.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    // 🔍 Find post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // 🔐 Only owner can delete
    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your post",
      });
    }

    // 🗑️ Delete media from Cloudinary
    if (post.mediaUrls && post.mediaUrls.length > 0) {
      for (const url of post.mediaUrls) {
        try {
          // extract public_id from Cloudinary URL
          const publicId = url.split("/").slice(-2).join("/").split(".")[0];

          await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto",
          });
        } catch (err) {
          console.error("Cloudinary delete error:", err.message);
        }
      }
    }

    // 🗑️ Delete post from DB
    await Post.findByIdAndDelete(postId);

    return res.json({
      success: true,
      message: "Post deleted successfully",
      postId,
    });
  } catch (err) {
    next(err);
  }
};
exports.getFeed = async (req, res, next) => {
  try {
    const posts = await Post.find({ visibility: "public" })
      .sort({ createdAt: -1 })
      .populate("owner", "name profile.avatarUrl college.name")
      .populate("likes", "name")
      .limit(20);

    return res.json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

/*
 * TOGGLE LIKE
 * PUT /api/posts/:id/like
 */
exports.toggleLike = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user already liked
    const index = post.likes.indexOf(userId);
    let isLiked = false;

    if (index === -1) {
      post.likes.push(userId);
      isLiked = true;
    } else {
      post.likes.splice(index, 1);
      isLiked = false;
    }

    await post.save();

    return res.json({
      success: true,
      isLiked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    next(err);
  }
};
