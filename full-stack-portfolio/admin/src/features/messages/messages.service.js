import api from "@/api/axios";

const messagesService = {
    getMessages: async () => {
        const response = await api.get("/messages");
        return response.data.data;
    },
    markMessageRead: async (id) => {
        const response = await api.put(`/messages/${id}/read`);
        return response.data.data;
    },
    deleteMessage: async (id) => {
        const response = await api.delete(`/messages/${id}`);
        return response.data.data;
    },
};

export default messagesService;
