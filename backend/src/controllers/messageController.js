const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");

// backend/controllers/messageController.js
module.exports.getMessagesByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id.toString();

    // 1. Get Messages
    const messages = await Message.find({ roomId }).sort({ createdAt: 1 });

    // 2. Get Room info to find the recipient (otherUser)
    const room = await ChatRoom.findById(roomId).populate("members", "name");
    const otherUser = room.members.find((m) => m._id.toString() !== userId);

    // 3. Return a unified Object
    res.json({
      messages,
      otherUser,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch room data" });
  }
};

module.exports.markAsSeen = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    // Add current user to seenBy array for all messages in this room
    // where they aren't already included
    await Message.updateMany(
      { roomId, seenBy: { $ne: userId } },
      { $addToSet: { seenBy: userId } }
    );

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark messages as seen" });
  }
};

// Edit a message
module.exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { newText } = req.body;
    const userId = req.user._id;

    const message = await Message.findOneAndUpdate(
      { _id: messageId, sender: userId }, // Only allow the sender to edit
      { text: newText, isEdited: true },
      { new: true }
    ).populate("sender", "name");

    if (!message)
      return res
        .status(404)
        .json({ error: "Message not found or unauthorized" });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to edit message" });
  }
};

// Delete a message
module.exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOneAndDelete({
      _id: messageId,
      sender: userId,
    });

    if (!message)
      return res
        .status(404)
        .json({ error: "Message not found or unauthorized" });

    res.json({ message: "Message deleted successfully", messageId });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
