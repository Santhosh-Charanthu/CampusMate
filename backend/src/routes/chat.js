const express = require("express");
const router = express.Router();
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const { requireAuth } = require("../middleware/authMiddleware");

// Get rooms for current user (with members data and last message)
router.get("/rooms", requireAuth, async (req, res, next) => {
  try {
    const rooms = await ChatRoom.find({ members: req.user._id }).populate("members", "name username avatar");

    // fetch last message per room
    const roomsWithLast = await Promise.all(
      rooms.map(async (r) => {
        const last = await Message.find({ roomId: r._id }).sort({ createdAt: -1 }).limit(1).populate("sender", "name username avatar");
        // unread messages for current user: messages where seenBy does not include req.user._id
        const unreadCount = await Message.countDocuments({ roomId: r._id, seenBy: { $ne: req.user._id } });
        return { room: r, lastMessage: last[0] || null, unread: unreadCount };
      })
    );

    return res.json({ rooms: roomsWithLast });
  } catch (err) {
    next(err);
  }
});

// Create or get a private room between members
router.post("/rooms", requireAuth, async (req, res, next) => {
  try {
    const { members = [] } = req.body; // array of userIds
    const set = [...new Set([...members, req.user._id.toString()])];
    // Try to find existing private room with same members
    let room = await ChatRoom.findOne({ type: "private", members: { $size: set.length, $all: set } });
    if (!room) {
      room = new ChatRoom({ type: "private", members: set });
      await room.save();
    }
    const populated = await room.populate("members", "name username avatar");
    return res.json(populated);
  } catch (err) {
    next(err);
  }
});

// Get messages in a room
router.get("/rooms/:id/messages", requireAuth, async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // check membership
    if (!room.members.some((m) => m.equals(req.user._id))) return res.status(403).json({ message: "Not a member" });

    // mark messages as seen by current user
    await Message.updateMany({ roomId, seenBy: { $ne: req.user._id } }, { $addToSet: { seenBy: req.user._id } });

    const messages = await Message.find({ roomId }).sort({ createdAt: 1 }).populate("sender", "name username avatar");
    return res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// Post a message to a room
router.post("/rooms/:id/messages", requireAuth, async (req, res, next) => {
  try {
    const roomId = req.params.id;
    const { text = "", mediaUrl = null } = req.body;
    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (!room.members.some((m) => m.equals(req.user._id))) return res.status(403).json({ message: "Not a member" });

    const msg = new Message({ roomId, sender: req.user._id, text, mediaUrl });
    await msg.save();
    const populated = await msg.populate("sender", "name username avatar");
    return res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
