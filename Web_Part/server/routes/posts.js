import express from "express";
import { getFeedPosts, getUserPosts, likePost, addCommentToPost,getUserPostCount } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/",  getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:userId/postCount", getUserPostCount);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, addCommentToPost); // New route for adding comments

export default router;
