import { Router } from "express";
import {
    createProject,
    deleteProject,
    getAllProjects,
    getPublicProjects,
    getProjectById,
    updateProject
} from "./project.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllProjects).post(upload.single("image"), createProject);
router.route("/public").get(getPublicProjects);
router.route("/:id").get(getProjectById).put(upload.single("image"), updateProject).delete(deleteProject);

export default router;
