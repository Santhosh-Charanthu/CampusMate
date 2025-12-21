const mongoose = require("mongoose");
const User = require("../models/User");
const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");

module.exports.getOrCreatePrivateRoom = async (req, res) => {
  try {
    console.log(req.user.id);
    const currentUserId = req.user._id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ message: "targetUserId required" });
    }

    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "Cannot chat with yourself" });
    }

    let room = await ChatRoom.findOne({
      type: "private",
      members: {
        $all: [currentUserId, targetUserId],
        $size: 2,
      },
    });

    if (!room) {
      room = await ChatRoom.create({
        type: "private",
        members: [currentUserId, targetUserId],
      });
    }

    res.status(200).json(room);
  } catch (err) {
    console.error("❌ getOrCreatePrivateRoom error:", err);
    res.status(500).json({ message: "Failed to create chat room" });
  }
};

exports.getMyChats = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const rooms = await ChatRoom.find({
      type: "private",
      members: userId,
    })
      .populate("members", "name email")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const inbox = await Promise.all(
      rooms.map(async (room) => {
        const lastRead = room.lastRead?.get(userId) || new Date(0);

        const unreadCount = await Message.countDocuments({
          roomId: room._id,
          createdAt: { $gt: lastRead },
          sender: { $ne: userId },
        });

        const otherUser = room.members.find((m) => m._id.toString() !== userId);

        return {
          roomId: room._id,
          otherUser,
          lastMessage: room.lastMessage,
          unreadCount,
          updatedAt: room.updatedAt,
        };
      })
    );

    res.json(inbox);
  } catch (err) {
    console.error("❌ Chat inbox error:", err);
    res.status(500).json({ message: "Failed to load inbox" });
  }
};

module.exports.markAsRead = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id.toString();

  await ChatRoom.findByIdAndUpdate(roomId, {
    $set: {
      [`lastRead.${userId}`]: new Date(),
    },
  });

  res.json({ success: true });
};
