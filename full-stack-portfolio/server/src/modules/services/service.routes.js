import { Router } from "express";
import {
    createService,
    deleteService,
    getAllServices,
    getServiceById,
    updateService
} from "./service.controller.js";
import {
    createPlan,
    deletePlan,
    getAllPlans,
    getPlanById,
    updatePlan
} from "./plans.controller.js";

const router = Router();

router.route("/").get(getAllServices).post(createService);
router.route("/plans").get(getAllPlans).post(createPlan);
router.route("/plans/:id").get(getPlanById).put(updatePlan).delete(deletePlan);

router.route("/:id").get(getServiceById).put(updateService).delete(deleteService);

export default router;
