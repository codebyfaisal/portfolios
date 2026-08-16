import api from "@/api/axios";

const configService = {
    getConfig: async () => {
        const response = await api.get("/users/me/config");
        return response.data.data;
    },
    updateConfig: async (data) => {
        const response = await api.post("/users/me/config", data);
        return response.data.data;
    },
    updateUser: async (data) => {
        const response = await api.put("/users/me", data);
        return response.data.data;
    },
};

export default configService;
