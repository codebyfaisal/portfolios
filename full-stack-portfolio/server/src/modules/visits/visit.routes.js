import { Router } from "express";
import {
    logVisit,
    getVisitStats,
    getAllVisits,
    deleteVisits,
    getVisitConfig,
    cleanupVisits
} from "./visit.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/").post(logVisit);
router.route("/config").get(getVisitConfig);

// Secured Routes
router.route("/stats").get(verifyJWT, getVisitStats);
router.route("/").get(verifyJWT, getAllVisits);
router.route("/").delete(verifyJWT, deleteVisits);
router.route("/cleanup").post(verifyJWT, cleanupVisits);

export default router;
