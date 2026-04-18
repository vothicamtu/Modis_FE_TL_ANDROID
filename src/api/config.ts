import axios from "axios";
import { loadTokenFromStorage } from "../utils/token";

const api = axios.create({
    baseURL: "https://modis-backend.onrender.com/",
    timeout: 60000,
});

// Interceptor gắn JWT cho tất cả request
api.interceptors.request.use(async (config) => {
    const token = await loadTokenFromStorage();
    console.log("JWT token:", token);
    console.log("Request URL:", config.url);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
