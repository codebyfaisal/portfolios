import axios from "axios";
import usePortfolioStore from "../store/usePortfolioStore";

export const BASE_API_URL =
  import.meta.env.VITE_BASE_API_URL ||
  (import.meta.env.PROD ? "/api/v1" : "http://localhost:4000/api/v1");

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
        if (!error.response || error.response.status >= 500) {
            usePortfolioStore.getState().setServerError(true);
        }

        let message = "Something went wrong";
        if (error.code === "ECONNABORTED") {
            message = "Request timed out. Please check your connection.";
        } else if (error.code === "ERR_NETWORK" || !error.response) {
            message = "Network error. Unable to connect to server.";
        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        }

        if (import.meta.env.DEV) {
            console.error("API Error:", message);
        }

        return Promise.reject(new Error(message));
    }
);

export default api;
