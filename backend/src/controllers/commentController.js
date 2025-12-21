const Comment = require("../models/Comment");
const Post = require("../models/Post");

/*
 * ADD COMMENT
 * POST /api/posts/:postId/comments
 */
exports.addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

<<<<<<< HEAD
    if (!text) return res.status(400).json({ message: "Comment text is required" });
=======
    if (!text)
      return res.status(400).json({ message: "Comment text is required" });
>>>>>>> origin/nagasai

    // 1. Create Comment
    const comment = new Comment({
      postId,
      user: req.user._id,
      text,
    });
    await comment.save();

    // 2. Add comment ID to the Post document (for fast counting)
    await Post.findByIdAndUpdate(postId, {
<<<<<<< HEAD
      $push: { comments: comment._id }
    });

    // 3. Populate user details immediately 
=======
      $push: { comments: comment._id },
    });

    // 3. Populate user details immediately
>>>>>>> origin/nagasai
    // (So frontend can display it at the top without refreshing)
    await comment.populate("user", "name profile.avatarUrl");

    return res.status(201).json({
      success: true,
<<<<<<< HEAD
      comment, 
    });

=======
      comment,
    });
>>>>>>> origin/nagasai
  } catch (err) {
    next(err);
  }
};

/*
 * GET COMMENTS (With Pagination)
 * GET /api/posts/:postId/comments?page=1&limit=10
 */
exports.getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default show 5 comments
    const skip = (page - 1) * limit;

    // Fetch comments for this post
    // Sort by createdAt: -1 (Newest first) so recent comments are top
    const comments = await Comment.find({ postId })
<<<<<<< HEAD
      .sort({ createdAt: -1 }) 
=======
      .sort({ createdAt: -1 })
>>>>>>> origin/nagasai
      .skip(skip)
      .limit(limit)
      .populate("user", "name profile.avatarUrl");

    // Get total count for "Show More" logic (e.g., "View 15 more comments")
    const totalComments = await Comment.countDocuments({ postId });
<<<<<<< HEAD
    const hasMore = totalComments > (skip + comments.length);
=======
    const hasMore = totalComments > skip + comments.length;
>>>>>>> origin/nagasai

    return res.json({
      success: true,
      comments,
      pagination: {
        total: totalComments,
        page,
<<<<<<< HEAD
        hasMore
      }
    });

  } catch (err) {
    next(err);
  }
};
=======
        hasMore,
      },
    });
  } catch (err) {
    next(err);
  }
};
>>>>>>> origin/nagasai
