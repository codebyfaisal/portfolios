import axios from "axios";
import { BASE_API_URL } from "@/utils/constant.js";
import useDashboardStore from "@/store/useDashboardStore";

const api = axios.create({
    baseURL: BASE_API_URL,
    withCredentials: true,
    timeout: 10000, // 10 seconds timeout protection
});

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Safe message extraction covering network errors and timeouts
        let message = "An unexpected error occurred";
        if (error.code === "ECONNABORTED") {
            message = "Request timed out. Please check your connection and try again.";
        } else if (error.code === "ERR_NETWORK" || !error.response) {
            message = "Unable to connect to the server. Please check your network connection.";
        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        } else if (error.message) {
            message = error.message;
        }

        // Global 401 Unauthorized handling
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            if (currentPath !== "/login") {
                // Clear user session state and redirect to login
                useDashboardStore.setState({ user: null, authError: "Session expired. Please log in again." });
                window.location.href = "/login";
            }
        }

        if (import.meta.env.DEV) {
            console.error("API Error:", message, error);
        }

        return Promise.reject(new Error(message));
    }
);

export default api;
