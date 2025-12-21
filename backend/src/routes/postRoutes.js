const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const { requireAuth } = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

// --- TEMPORARY UPLOAD MIDDLEWARE ---
// (Since you don't have the real upload middleware yet, this prevents the app from crashing)
// (Your teammate will replace this with the real Multer middleware later)

// ==========================
// YOUR ASSIGNED FEATURES
// ==========================

// 1. Likes
router.put("/:id/like", requireAuth, postController.toggleLike);

// 2. Comments
router.post("/:postId/comments", requireAuth, commentController.addComment);
router.get("/:postId/comments", requireAuth, commentController.getComments);

// ==========================
// HELPER ROUTES (For Testing)
// ==========================
// Even though these aren't your task, keep them so you can create posts to test likes!

// Create Post (Uses dummy upload for now)
// router.post("/", requireAuth, upload.array("media"), postController.createPost);
// NEW (Temporary Test)
router.post("/", requireAuth, postController.createPost);

router.post(
  "/:userId",
  requireAuth,
  upload.array("media", 5),
  postController.createPost
);
// GET POST FOR EDIT PAGE

router.put(
  "/:postId/edit",
  requireAuth,
  upload.array("media", 5),
  postController.editPost
);
router.delete("/:postId/delete", requireAuth, postController.deletePost);

// Get Feed
router.get("/", requireAuth, postController.getFeed);

module.exports = router;
