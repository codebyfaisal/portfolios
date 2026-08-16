import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { TestimonialService } from "./testimonial.service.js";

const createTestimonial = asyncHandler(async (req, res) => {
    const { name, role, text, avatar, hasVideo, videoType, videoUrl } = req.body;
    const testimonial = await TestimonialService.createTestimonial({ name, role, text, avatar, hasVideo, videoType, videoUrl });

    return res.status(201).json(
        new ApiResponse(201, testimonial, "Testimonial created successfully")
    );
});

const getAllTestimonials = asyncHandler(async (req, res) => {

    const testimonials = await TestimonialService.getAllTestimonials();
    return res.status(200).json(
        new ApiResponse(200, testimonials, "Testimonials fetched successfully")
    );
});

const getTestimonialById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const testimonial = await TestimonialService.getTestimonialById(id);

    return res.status(200).json(
        new ApiResponse(200, testimonial, "Testimonial fetched successfully")
    );
});

const updateTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, role, text, avatar, hasVideo, videoType, videoUrl } = req.body;
    const testimonial = await TestimonialService.updateTestimonial(id, { name, role, text, avatar, hasVideo, videoType, videoUrl });

    return res.status(200).json(
        new ApiResponse(200, testimonial, "Testimonial updated successfully")
    );
});

const deleteTestimonial = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await TestimonialService.deleteTestimonial(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Testimonial deleted successfully")
    );
});

export {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
};
