import api from "@/api/axios";

const testimonialsService = {
    getTestimonials: async () => {
        const response = await api.get("/testimonials");
        return response.data.data;
    },
    createTestimonial: async (data) => {
        const response = await api.post("/testimonials", data);
        return response.data.data;
    },
    updateTestimonial: async (id, data) => {
        const response = await api.put(`/testimonials/${id}`, data);
        return response.data.data;
    },
    deleteTestimonial: async (id) => {
        const response = await api.delete(`/testimonials/${id}`);
        return response.data.data;
    },
};

export default testimonialsService;
