import api from "@/api/axios";

const authService = {
    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data.data;
    },
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data.data;
    },
    pingSessionLogout: async () => {
        try {
            await api.post("/auth/sessions/ping-logout");
        } catch (err) {
            // Ignore unload errors
        }
    },
    getUser: async () => {
        try {
            const response = await api.get("/users/me");
            return response.data.data;
        } catch (error) {
            console.error("Error getting user:", error);
            throw error;
        }
    },
    updateUser: async (data) => {
        const response = await api.put("/users/me", data);
        return response.data.data;
    },
    checkAdminExists: async () => {
        const response = await api.get("/auth/admin-exists");
        return response.data.data;
    },
    getLoginHistory: async () => {
        const response = await api.get("/auth/login-history");
        return response.data.data;
    },
    revokeSession: async (sessionId) => {
        const response = await api.post(`/auth/sessions/revoke/${sessionId}`);
        return response.data.data;
    },
    revokeAllOtherSessions: async () => {
        const response = await api.post("/auth/sessions/revoke-others");
        return response.data.data;
    },
    revokeAllSessions: async () => {
        const response = await api.post("/auth/sessions/revoke-all");
        return response.data.data;
    },
};

export default authService;
