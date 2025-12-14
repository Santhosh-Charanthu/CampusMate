const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
  type: { type: String, enum: ["private", "group"], required: true },

  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // for group chat
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
