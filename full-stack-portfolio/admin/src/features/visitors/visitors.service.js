import api from "@/api/axios";

const visitorsService = {
    getOverviewStats: async () => {
        const response = await api.get("/dashboard/stats");
        return response.data.data;
    },
    getVisitorStats: async () => {
        const response = await api.get("/visits/stats");
        return response.data.data;
    },
    getVisits: async (params) => {
        const response = await api.get("/visits", { params });
        return response.data.data;
    },
    deleteVisits: async (ids) => {
        const response = await api.delete("/visits", { data: { ids } });
        return response.data.data;
    },
    cleanupVisits: async () => {
        const response = await api.post("/visits/cleanup");
        return response.data.data;
    },
};

export default visitorsService;
