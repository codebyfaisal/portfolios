import { Router } from "express";
import {
    getPosts,
    getPublicPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    getLikeStatus
} from "./post.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.get("/public", getPublicPosts);
router.get("/public/:slug", getPostBySlug);
router.post("/:id/like", toggleLike);
router.get("/:id/like-status", getLikeStatus);

// Protected Routes (Dashboard)
router.use(verifyJWT);
router.route("/").get(getPosts).post(createPost);
router.route("/:id").put(updatePost).delete(deletePost);

export default router;
