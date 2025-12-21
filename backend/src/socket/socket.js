const User = require("../models/User");
const chatHandler = require("../handlers/chatHandler");
const socketAuth = require("../middleware/socketAuth");

// function initSocket(io) {
//   io.use(socketAuth);
//   io.on("connection", (socket) => {
//     console.log("✅ Socket connected:", socket.id);

//     // Register chat events
//     chatHandler(io, socket);

//     socket.on("disconnect", () => {
//       console.log("❌ Socket disconnected:", socket.id);
//     });
//   });
// }

function initSocket(io) {
  io.use(socketAuth);
  // Keep track of active connections per user
  const userConnections = new Map(); // { userId: count }
  io.on("connection", async (socket) => {
    const userId = socket.user.id;

    // 1. Increment connection count
    const currentCount = userConnections.get(userId) || 0;
    userConnections.set(userId, currentCount + 1);

    // 2. Only update DB and broadcast if this is the FIRST tab opening
    if (currentCount === 0) {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      socket.broadcast.emit("user_status_change", {
        userId,
        isOnline: true,
      });
      console.log(`User ${userId} is now Online (First tab)`);
    }

    // ✅ Join a private room just for this user
    socket.join(userId);
    console.log(`✅ User ${userId} joined their private notification room`);

    chatHandler(io, socket);

    // socket.on("disconnect", async () => {
    //   // 3. Mark User Offline in DB
    //   await User.findByIdAndUpdate(userId, {
    //     isOnline: false,
    //     lastSeen: new Date(),
    //   });

    //   // 4. Broadcast to everyone: "I am offline"
    //   socket.broadcast.emit("user_status_change", { userId, isOnline: false });
    //   console.log("❌ Socket disconnected:", socket.id);
    // });

    socket.on("disconnect", async () => {
      console.log("❌ Socket disconnected:", socket.id);
      const newCount = userConnections.get(userId) - 1;

      if (newCount <= 0) {
        // 3. Only update DB and broadcast if this was the LAST tab closed
        userConnections.delete(userId);
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });
        socket.broadcast.emit("user_status_change", {
          userId,
          isOnline: false,
          lastSeen: new Date(),
        });
        console.log(`User ${userId} is now Offline (Last tab closed)`);
      } else {
        // Just decrement the count, user is still online in another tab
        userConnections.set(userId, newCount);
        console.log(`User ${userId} closed a tab. Remaining tabs: ${newCount}`);
      }
    });
  });
}

module.exports = initSocket;
