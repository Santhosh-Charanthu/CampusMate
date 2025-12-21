const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ChatRoom = require("../models/ChatRoom");
const { requireAuth } = require("../middleware/authMiddleware");

// Follow a user
router.put("/:id/follow", requireAuth, async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const me = req.user;
    if (me._id.equals(targetId)) return res.status(400).json({ message: "Cannot follow yourself" });

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    // add to following/followers if not present
    const alreadyFollowing = me.following.some((id) => id.equals(target._id));
    if (!alreadyFollowing) {
      me.following.push(target._id);
      target.followers.push(me._id);
      await me.save();
      await target.save();

      // create private chat room between the two if not exists so they appear in messaging
      const existingRoom = await ChatRoom.findOne({ type: "private", members: { $all: [me._id, target._id] } });
      if (!existingRoom) {
        const room = new ChatRoom({ type: "private", members: [me._id, target._id] });
        await room.save();
      }
    }

    const publicTarget = await User.findById(targetId).select("name username avatar followers following");
    return res.json({ success: true, following: true, user: publicTarget });
  } catch (err) {
    next(err);
  }
});

// Unfollow
router.put("/:id/unfollow", requireAuth, async (req, res, next) => {
  try {
    const targetId = req.params.id;
    const me = req.user;
    if (me._id.equals(targetId)) return res.status(400).json({ message: "Cannot unfollow yourself" });

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ message: "User not found" });

    me.following = me.following.filter((id) => !id.equals(target._id));
    target.followers = target.followers.filter((id) => !id.equals(me._id));

    await me.save();
    await target.save();

    return res.json({ success: true, following: false });
  } catch (err) {
    next(err);
  }
});

// Get list of accounts I follow (authenticated)
router.get("/me/following", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("following", "name username avatar");
    return res.json({ following: user.following });
  } catch (err) {
    next(err);
  }
});

// Get list of accounts a user follows by id
router.get("/:id/following", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "name username avatar");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ following: user.following });
  } catch (err) {
    next(err);
  }
});

// Get list of accounts the current authenticated user follows
router.get("/me/following", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("following", "name username avatar");
    return res.json({ following: user.following });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
