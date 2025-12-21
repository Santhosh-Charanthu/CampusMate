// const Post = require("../models/Post");
// const User = require("../models/User"); // Un-comment if needed later

/*
 * CREATE A NEW POST (Text only for now)
 * POST /api/posts
 */


const Post = require("../models/Post")

exports.createPost = async (req, res, next) => {
  try {
    const { caption, visibility, groupId } = req.body;
    
    // Simple check since we removed the file uploader for testing
    const type = "text"; 
    const mediaUrls = []; 

    const newPost = new Post({
      owner: req.user._id, 
      caption,
      mediaUrls,
      visibility: visibility || "public",
      groupId: groupId || null,
      type,
    });

    await newPost.save();

    // Populate owner details for immediate UI update
    await newPost.populate("owner", "name profile.avatarUrl");

    return res.status(201).json({
      success: true,
      post: newPost,
    });

  } catch (err) {
    next(err);
  }
};

/*
 * GET FEED (All Public Posts)
 * GET /api/posts
 */
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
      likesCount: post.likes.length 
    });

  } catch (err) {
    next(err);
  }
};