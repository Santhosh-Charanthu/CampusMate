const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const { requireAuth } = require("../middleware/authMiddleware");

// create a post
router.post("/", requireAuth, async (req, res, next) => {
	try {
		const { caption, mediaUrls = [], visibility = "public" } = req.body;
		const post = new Post({ owner: req.user._id, caption, mediaUrls, visibility });
		await post.save();
		return res.status(201).json(post);
	} catch (err) {
		next(err);
	}
});

// share a post: optionally share to my feed, and send as messages to followed users
router.post("/:id/share", requireAuth, async (req, res, next) => {
	try {
		const postId = req.params.id;
		const { shareToFeed = false, shareTo = [], text = "" } = req.body; // shareTo: array of user ids

		const orig = await Post.findById(postId).populate("owner", "name username");
		if (!orig) return res.status(404).json({ message: "Original post not found" });

		const results = { sharedToFeed: false, messagesSent: 0 };

		if (shareToFeed) {
			const newPost = new Post({
				owner: req.user._id,
				caption: text || (orig.caption ? `Shared: ${orig.caption}` : ""),
				mediaUrls: orig.mediaUrls,
				visibility: orig.visibility,
			});
			await newPost.save();
			results.sharedToFeed = true;
		}

		// send share as messages to selected users
		for (const uid of shareTo) {
			// find or create private chatroom between req.user and uid
			let room = await ChatRoom.findOne({ type: "private", members: { $all: [req.user._id, uid] } });
			if (!room) {
				room = new ChatRoom({ type: "private", members: [req.user._id, uid] });
				await room.save();
			}

			const msg = new Message({
				roomId: room._id,
				sender: req.user._id,
				text: text || `Shared a post: ${postId}`,
				mediaUrl: orig.mediaUrls && orig.mediaUrls[0],
			});
			await msg.save();
			results.messagesSent += 1;
		}

		return res.json(results);
	} catch (err) {
		next(err);
	}
});

module.exports = router;

