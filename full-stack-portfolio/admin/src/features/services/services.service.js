import api from "@/api/axios";

const servicesService = {
    getServices: async () => {
        const response = await api.get("/services");
        return response.data.data;
    },
    createService: async (data) => {
        const response = await api.post("/services", data);
        return response.data.data;
    },
    updateService: async (id, data) => {
        const response = await api.put(`/services/${id}`, data);
        return response.data.data;
    },
    deleteService: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data.data;
    },
};

export default servicesService;
