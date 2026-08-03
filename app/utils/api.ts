import axios from "axios";

// export const BASE_API_URL = "http://localhost:3003/api";
// export const UPLOADS_URL = "http://localhost:3003/uploads"; 
export const BASE_API_URL = "https://api.bigleaptech.in/api";
export const UPLOADS_URL = "https://api.bigleaptech.in/uploads";

export const httpClient = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, // ← add this
});

httpClient.interceptors.request.use(
    (config) => {
        // ✅ Only access localStorage in the browser
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("student_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // ✅ Guard here too
            if (typeof window !== "undefined") {
                localStorage.removeItem("student_token");
                localStorage.removeItem("student");
                window.location.href = "/login-page";
            }
        }
        return Promise.reject(error);
    },
);

export const imageUrl = UPLOADS_URL;
export default httpClient;