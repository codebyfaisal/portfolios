import { Router } from "express";
import {
    createTestimonial,
    deleteTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial
} from "./testimonial.controller.js";

const router = Router();

router.route("/").get(getAllTestimonials).post(createTestimonial);
router.route("/:id").get(getTestimonialById).put(updateTestimonial).delete(deleteTestimonial);

export default router;
