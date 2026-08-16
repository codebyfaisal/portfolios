import api from "@/api/axios";

const plansService = {
    getPlans: async () => {
        const response = await api.get("/services/plans");
        return response.data.data;
    },
    createPlan: async (data) => {
        const response = await api.post("/services/plans", data);
        return response.data.data;
    },
    updatePlan: async (id, data) => {
        const response = await api.put(`/services/plans/${id}`, data);
        return response.data.data;
    },
    deletePlan: async (id) => {
        const response = await api.delete(`/services/plans/${id}`);
        return response.data.data;
    },
};

export default plansService;
