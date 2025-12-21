const User = require("../models/User");



// ... existing getMutuals code ...

/*
 * FOLLOW / UNFOLLOW USER
 * PUT /api/users/:id/follow
 */
exports.followUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id; // The person I want to follow
    const currentUserId = req.user._id; // Me

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    const isFollowing = currentUser.social.following.includes(targetUserId);

    if (isFollowing) {
      // UNFOLLOW LOGIC
      // 1. Remove target from my 'following'
      currentUser.social.following.pull(targetUserId);
      // 2. Remove me from target's 'followers'
      targetUser.social.followers.pull(currentUserId);
      await currentUser.save();
      await targetUser.save();

      return res.json({ success: true, message: "Unfollowed user", isFollowing: false });
    } else {
      // FOLLOW LOGIC
      // 1. Add target to my 'following'
      currentUser.social.following.push(targetUserId);
      // 2. Add me to target's 'followers'
      targetUser.social.followers.push(currentUserId);
      await currentUser.save();
      await targetUser.save();

      return res.json({ success: true, message: "Followed user", isFollowing: true });
    }

  } catch (err) {
    next(err);
  }
};

// GET /api/users/mutuals
exports.getMutuals = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;

    // 1. Get the current user's following list
    const currentUser = await User.findById(currentUserId).select("social.following");

    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // 2. Find users who:
    //    a) Are in MY 'following' list
    //    b) Have ME in THEIR 'following' list (Mutual)
    const mutuals = await User.find({
      _id: { $in: currentUser.social.following },
      "social.following": currentUserId // They must follow me back
    })
    .select("name profile.avatarUrl profile.department"); // Select only what's needed for the UI

    return res.json({
      success: true,
      count: mutuals.length,
      users: mutuals
    });

  } catch (err) {
    next(err);
  }
};