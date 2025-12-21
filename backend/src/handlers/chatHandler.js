const Message = require("../models/Message");
const ChatRoom = require("../models/ChatRoom");

function chatHandler(io, socket) {
  socket.on("join_room", (roomId) => {
    console.log("➡️ join_room received:", roomId);
    socket.join(roomId);
  });

  // socket.on("send_message", async ({ roomId, text }) => {
  //   try {
  //     const senderId = socket.user.id; // comes from auth middleware

  //     const message = await Message.create({
  //       roomId,
  //       sender: senderId,
  //       text,
  //       seenBy: [senderId],
  //     });

  //     // update last message
  //     await ChatRoom.findByIdAndUpdate(roomId, {
  //       lastMessage: message._id, // Update the reference
  //       updatedAt: new Date(), // Crucial for sorting the inbox
  //     });
  //     io.to(roomId).emit("receive_message", message);
  //   } catch (err) {
  //     console.error("❌ send_message error:", err);
  //   }
  // });
  socket.on("send_message", async ({ roomId, text }) => {
    try {
      const senderId = socket.user.id;

      // 1. Create message
      const message = await Message.create({
        roomId,
        sender: senderId,
        text,
        seenBy: [senderId],
      });

      // 2. Update Room (Optimal way)
      const room = await ChatRoom.findByIdAndUpdate(
        roomId,
        { lastMessage: message._id, updatedAt: new Date() },
        { new: true } // Return the updated room to get members
      );

      // 3. Emit to the specific Chat Room (for the person currently chatting)
      io.to(roomId).emit("receive_message", message);

      // 4. ✅ Emit to each member's private room (for the person on the Inbox Page)
      room.members.forEach((memberId) => {
        const memberStr = memberId.toString();
        // We don't necessarily need to emit to the sender again,
        // but emitting to the recipient's ID is what updates their Inbox live.
        if (memberStr !== senderId) {
          io.to(memberStr).emit("receive_message", message);
        }
      });
    } catch (err) {
      console.error("❌ send_message error:", err);
    }
  });

  socket.on("typing_start", ({ roomId, recipientId }) => {
    // Send "User X is typing" directly to the recipient's private room
    io.to(recipientId).emit("user_typing", { roomId, isTyping: true });
  });

  socket.on("typing_stop", ({ roomId, recipientId }) => {
    io.to(recipientId).emit("user_typing", { roomId, isTyping: false });
  });

  socket.on("mark_seen", ({ roomId, recipientId }) => {
    // Notify the person who sent the messages that they've been seen
    io.to(recipientId).emit("messages_seen_update", { roomId });
  });

  socket.on("message_updated", ({ roomId, updatedMessage }) => {
    console.log("📝 Broadcast Edit to room:", roomId);
    // Use io.to() instead of socket.to() to ensure it hits everyone
    io.to(roomId).emit("message_edited", updatedMessage);
  });

  socket.on("message_deleted", ({ roomId, messageId }) => {
    console.log("🗑️ Broadcast Delete to room:", roomId);
    // Use io.to() instead of socket.to() to ensure it hits everyone
    io.to(roomId).emit("message_removed", messageId);
  });
}

module.exports = chatHandler;
