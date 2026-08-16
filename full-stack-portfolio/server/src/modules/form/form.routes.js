import { Router } from "express";
import {
    createForm,
    deleteForm,
    getForm,
    getForms,
    updateForm,
} from "./form.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public
router.route("/").get(getForms);
router.route("/:id").get(getForm);

// Protected (Admin)
router.route("/").post(verifyJWT, createForm);
router.route("/:id").put(verifyJWT, updateForm).delete(verifyJWT, deleteForm);

export default router;
