import { Testimonial } from "./testimonial.model.js";
import { ApiError } from "../../utils/ApiError.js";

const createTestimonial = async (data) => {
    return await Testimonial.create(data);
};

const getAllTestimonials = async () => {
    return await Testimonial.find();
};

const getTestimonialById = async (id) => {
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) throw new ApiError(404, "Testimonial not found");
    return testimonial;
};

const updateTestimonial = async (id, data) => {
    const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    );
    if (!testimonial) throw new ApiError(404, "Testimonial not found");
    return testimonial;
};

const deleteTestimonial = async (id) => {
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) throw new ApiError(404, "Testimonial not found");
    return testimonial;
};

const countTestimonials = async () => {
    return await Testimonial.countDocuments();
};

export const TestimonialService = {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial,
    countTestimonials
};
