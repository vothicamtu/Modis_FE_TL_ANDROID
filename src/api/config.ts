import axios from "axios";
import { loadTokenFromStorage } from "../utils/token";

const api = axios.create({
    baseURL: "https://modis-backend.onrender.com/",
//     baseURL: "http://10.0.150.148:8080/",
    timeout: 90000, // 90s — Render free tier cold start có thể mất tới 80s
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
