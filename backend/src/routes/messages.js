const express = require("express");
const Message = require("../models/Message");
const { requireAuth } = require("../middleware/authMiddleware");
const messageControllers = require("../controllers/messageController");

const router = express.Router();

// GET old messages of a room
router.get("/:roomId", requireAuth, messageControllers.getMessagesByRoom);
router.post(":roomId/seen", requireAuth, messageControllers.markAsSeen);
router
  .put("/:messageId", requireAuth, messageControllers.editMessage)
  .delete("/:messageId", requireAuth, messageControllers.deleteMessage);

module.exports = router;
