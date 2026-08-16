import api from "@/api/axios";

const projectsService = {
    getProjects: async () => {
        const response = await api.get("/projects");
        return response.data.data;
    },
    createProject: async (data) => {
        const response = await api.post("/projects", data);
        return response.data.data;
    },
    updateProject: async (id, data) => {
        const response = await api.put(`/projects/${id}`, data);
        return response.data.data;
    },
    deleteProject: async (id) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data.data;
    },
};

export default projectsService;
