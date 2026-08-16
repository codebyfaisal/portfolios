import api from "@/api/axios";

const formsService = {
    getForms: async () => {
        const response = await api.get("/forms");
        return response.data.data;
    },
    createForm: async (data) => {
        const response = await api.post("/forms", data);
        return response.data.data;
    },
    updateForm: async (id, data) => {
        const response = await api.put(`/forms/${id}`, data);
        return response.data.data;
    },
    deleteForm: async (id) => {
        const response = await api.delete(`/forms/${id}`);
        return response.data;
    },
};

export default formsService;
