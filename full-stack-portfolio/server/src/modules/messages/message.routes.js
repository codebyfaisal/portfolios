import { Router } from "express";
import {
    createMessage,
    deleteMessage,
    getAllMessages,
    getMessageById,
    markMessageAsRead
} from "./message.controller.js";

const router = Router();

router.route("/").get(getAllMessages).post(createMessage);
router.route("/:id").get(getMessageById).delete(deleteMessage);
router.route("/:id/read").put(markMessageAsRead);

export default router;
