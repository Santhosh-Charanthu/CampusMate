const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const upload = require("../middleware/upload");

router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  auth.register
);
router.post("/login", auth.login);

module.exports = router;
