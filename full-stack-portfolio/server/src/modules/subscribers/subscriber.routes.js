import { Router } from "express";
import {
    subscribe,
    getSubscribers,
    deleteSubscriber,
} from "./subscriber.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public route
router.route("/subscribe").post(subscribe);

// Secured/Admin routes
router.route("/").get(verifyJWT, getSubscribers);
router.route("/:id").delete(verifyJWT, deleteSubscriber);

export default router;
