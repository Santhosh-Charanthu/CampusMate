const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const chatControllers = require("../controllers/chatroomController");

const router = express.Router();

router.post("/private", requireAuth, chatControllers.getOrCreatePrivateRoom);
router.get("/my", requireAuth, chatControllers.getMyChats);
router.post("/:roomId/read", requireAuth, chatControllers.markAsRead);

module.exports = router;
