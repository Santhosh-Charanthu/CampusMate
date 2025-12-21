const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const userControllers = require("../controllers/UsersController");

router.get("/users", requireAuth, userControllers.getAllUsers);

module.exports = router;
