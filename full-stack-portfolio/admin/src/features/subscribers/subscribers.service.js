import api from "@/api/axios";

const subscribersService = {
    getSubscribers: async () => {
        const response = await api.get("/subscribers");
        return response.data;
    },
    deleteSubscriber: async (id) => {
        const response = await api.delete(`/subscribers/${id}`);
        return response.data;
    },
};

export default subscribersService;
