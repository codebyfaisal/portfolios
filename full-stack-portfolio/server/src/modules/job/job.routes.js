import { Router } from "express";
import {
    createJob,
    deleteJob,
    getJob,
    getJobs,
    updateJob,
} from "./job.controller.js";
import {
    deleteApplication,
    getApplication,
    getApplications,
    submitApplication,
    updateApplicationStatus,
    trackApplications,
} from "./application.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public Routes
router.route("/jobs").get(getJobs);
router.route("/jobs/:id").get(getJob);
router.route("/applications").post(submitApplication);

// Protected Routes (Admin)
router.route("/jobs").post(verifyJWT, createJob);
router.route("/jobs/:id")
    .put(verifyJWT, updateJob)
    .delete(verifyJWT, deleteJob);

router.route("/applications").get(verifyJWT, getApplications);
router.route("/applications/:id")
    .get(verifyJWT, getApplication)
    .put(verifyJWT, updateApplicationStatus)
    .delete(verifyJWT, deleteApplication);

// Public Tracking (POST for email body)
router.route("/applications/track").post(trackApplications);

export default router;
