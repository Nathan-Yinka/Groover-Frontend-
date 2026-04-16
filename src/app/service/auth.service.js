import axiosInstance, { refreshAxiosInstance } from "../axiosConfig"; // Import the Axios instance
import {
    loginAPI,
    meAPI,
    refreshToken as refreshTokenAPI,
    registerAPI,
    settingsAPI,
} from "../../constants/api.routes"; // Use defined API routes
import {
    loginSuccess,
    loginFailure,
    setUserProfile,
    logout,
    registerSuccess,
    fetchSettingsStart,
    fetchSettingsSuccess,
    fetchSettingsFailure,
} from "../slice/auth.slice";
import { toast } from "sonner"; // Import Sonner for toast notifications
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to parse JWTs
import store from "../store"; // Import Redux store to dispatch actions

const authService = {
    /**
     * Validates the access token.
     */
    validateToken: (token) => {
        try {
            if (!token) return false;

            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // Current time in seconds

            // Check if the token has expired
            return decoded.exp && decoded.exp > currentTime;
        } catch (error) {
            console.error("Invalid token:", error);
            return false;
        }
    },

    /**
     * Registers a new user.
     */
    register: async (registrationData) => {
        try {
            const response = await axiosInstance.post(registerAPI, registrationData);
            store.dispatch(registerSuccess());
            console.log(response);
            return { success: true, message: "Registration successful." };
        } catch (error) {
            // let errorMessage = "Registration failed. Please try again.";
            // const errorData = error.response?.data;

            // // Handle nested or multiple error messages
            // if (errorData?.message) {
            //     if (typeof errorData.message === "string") {
            //         errorMessage = errorData.message;
            //     } else if (typeof errorData.message === "object") {
            //         const messages = Object.values(errorData.message).flat();
            //         errorMessage = messages[0] || errorMessage;
            //     }
            // } else if (errorData?.errors) {
            //     const errorMessages = Object.values(errorData.errors).flat();
            //     errorMessage = errorMessages[0] || errorMessage;
            // }

            // store.dispatch(registerFailure(errorMessage));
            // toast.error(errorMessage); // Show error message via toast
            return { success: false, message: error };
        }
    },

    /**
     * Logs in the user and updates the store with token and user profile.
     */
    login: async (credentials) => {
        try {
            const response = await axiosInstance.post(loginAPI, {
                username_or_email: credentials.username,
                password: credentials.password,
            });

            const { access_token, refresh_token, user } = response.data.data;

            // Store tokens in localStorage
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);

            // Dispatch login success
            store.dispatch(loginSuccess({ token: access_token, refreshToken: refresh_token }));
            store.dispatch(setUserProfile(user));

            return { success: true, data: user };
        } catch (error) {
            let errorMessage = "Login failed. Please try again.";
            const errorData = error.response?.data;

            if (errorData?.message) {
                if (typeof errorData.message === "string") {
                    errorMessage = errorData.message;
                } else if (typeof errorData.message === "object") {
                    const messages = Object.values(errorData.message).flat();
                    errorMessage = messages[0] || errorMessage;
                }
            }

            store.dispatch(loginFailure(errorMessage));
            // toast.error(errorMessage); // Show error message via toast
            return { success: false, message: errorMessage };
        }
    },

    /**
     * Fetches the current user's profile using the `meAPI` endpoint.
     */
    fetchProfile: async () => {
        try {
            const response = await axiosInstance.get(meAPI);
            const payload = response?.data?.data;
            const profile = payload?.data || payload || null;
            store.dispatch(setUserProfile(profile));
            console.log(profile);
            return { success: true, data: profile };
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            toast.error("Failed to fetch user profile."); // Show error via toast
            return { success: false, message: error || "Failed to fetch profile." };
        }
    },

    /**
     * Fetches application settings using the `settingAPI` endpoint.
     */
    fetchSettings: async () => {
        try {
            store.dispatch(fetchSettingsStart());
            const response = await axiosInstance.get(settingsAPI);
            const settings = response.data.data;
            store.dispatch(fetchSettingsSuccess(settings)); // Dispatch success with settings
            return { success: true, data: settings };
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to fetch settings.";
            console.error("Failed to fetch settings:", errorMessage);
            store.dispatch(fetchSettingsFailure(errorMessage)); // Dispatch failure
            toast.error(errorMessage); // Show error via toast
            return { success: false, message: error };
        }
    },

    /**
     * Logs the user out by clearing tokens and state.
     */
    logout: (show_toast = true) => {
        // Explicit logout by the user
        // localStorage.removeItem("accessToken");
        // localStorage.removeItem("refreshToken");
        Object.keys(sessionStorage).forEach((key) => {
            if (key.startsWith("hero_intro_seen_")) {
                sessionStorage.removeItem(key);
            }
        });
        store.dispatch(logout());

        show_toast && toast.success("Logged out successfully."); // Notify user of successful logout
    },

    /**
     * Refreshes the access token using the refresh token.
     */
    refreshAccessToken: async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) throw new Error("No refresh token found.");

            // Use the refreshAxiosInstance to send the refresh request
            const response = await refreshAxiosInstance.post(refreshTokenAPI, { refresh: refreshToken });
            const newAccessToken = response.data.data.access;
            const newRefreshToken = response.data.data.refresh;

            // Save the new access token
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            store.dispatch(loginSuccess({ token: newAccessToken }));

            return { success: true, token: newAccessToken };
        } catch (error) {
            console.error("Failed to refresh access token:", error.response?.data?.message || error.message);

            // Consolidate toast error for session expiration
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                authService.logout(false)
            }

            if (error.message === "No refresh token found.") {
                authService.logout(false)
            }

            return { success: false, message: error.response?.data?.message || "Failed to refresh token." };
        }
    },

    /**
     * Handles token expiration by refreshing the token or logging out.
     */
    handleTokenExpiration: async () => {
        try {
            return await authService.refreshAccessToken();
        } catch (error) {
            console.error("Error handling token expiration:", error);
            toast.error("Unable to refresh session. Please log in again.");
            return { success: false, message: "Session expired. Please log in again." };
        }
    },
};

export default authService;
