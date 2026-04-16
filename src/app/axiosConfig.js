import axios from "axios";
import { BASEURL } from "../constants/api.routes";
import authService from "./service/auth.service";
import store from "./store"; // Assuming you use Redux for state management
import { logout } from "../app/slice/auth.slice";
// import { logout } from "../../../app/slice/auth.slice"; 

let isRefreshing = false;
let refreshSubscribers = [];

// Notify all subscribers of the new token
const onTokenRefreshed = (token) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

// Add a new subscriber for the token refresh
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: BASEURL,
});

// Request interceptor to include access token
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If unauthorized and the request has not already been retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshResponse = await authService.refreshAccessToken();
                    isRefreshing = false;

                    if (refreshResponse.success) {
                        const newAccessToken = refreshResponse.token;

                        // Notify all subscribers with the new token
                        onTokenRefreshed(newAccessToken);

                        // Retry the original request with the new token
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axiosInstance(originalRequest);
                    }
                } catch (refreshError) {
                    isRefreshing = false;
                    console.error("Token refresh failed:", refreshError);
                    // Session expired, trigger logout and notify user
                    store.dispatch(logout());
                    return Promise.reject(refreshError);
                }
            }

            // Wait for the token refresh to complete
            return new Promise((resolve) => {
                addRefreshSubscriber((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(axiosInstance(originalRequest));
                });
            });
        }

        // Other error types, reject the promise
        return Promise.reject(error);
    }
);


export const refreshAxiosInstance = axios.create({
    baseURL: BASEURL,
});

export default axiosInstance;