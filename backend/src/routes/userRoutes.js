const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// Get mutual friends for "Share" list
router.get("/mutuals", requireAuth, userController.getMutuals);

// Follow/Unfollow a user
router.put("/:id/follow", requireAuth, userController.followUser);
module.exports = router;
