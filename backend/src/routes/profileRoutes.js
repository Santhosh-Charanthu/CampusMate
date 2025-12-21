const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const { requireAuth } = require("../middleware/authMiddleware");
const profileController = require("../controllers/profileController");

// profile routes
router.get("/myProfile", requireAuth, profileController.getMyProfile);
router.get("/:userId/profile", requireAuth, profileController.getUserProfile);
router.put(
  "/editProfile",
  requireAuth,
  upload.single("avatar"),
  profileController.editMyProfile
);
router.delete("/deleteProfile", requireAuth, profileController.deleteMyProfile);

module.exports = router;
