import api from "@/api/axios";

const jobsService = {
    getJobs: async (params) => {
        const response = await api.get("/jobs", { params });
        return response.data.data;
    },
    createJob: async (data) => {
        const response = await api.post("/jobs", data);
        return response.data.data;
    },
    updateJob: async (id, data) => {
        const response = await api.put(`/jobs/${id}`, data);
        return response.data.data;
    },
    deleteJob: async (id) => {
        const response = await api.delete(`/jobs/${id}`);
        return response.data.data;
    },
    
    getApplications: async (params) => {
        const response = await api.get("/applications", { params });
        return response.data.data;
    },
    updateApplication: async (id, data) => {
        const response = await api.put(`/applications/${id}`, data);
        return response.data.data;
    },
    deleteApplication: async (id) => {
        const response = await api.delete(`/applications/${id}`);
        return response.data.data;
    },
};

export default jobsService;
