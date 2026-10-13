import authService from "./service/auth.service";
import { setUserProfile } from "./slice/auth.slice";
import { fetchNotifications } from "./service/notifications.service"; // Import the fetchNotifications action
import { showAlert } from "./slice/ui.slice";

async function AppInit({ dispatch, isAuthenticated }) {
    try {
        if (isAuthenticated) {
            // Fetch the user profile
            const profileResponse = await authService.fetchProfile();
            if (profileResponse.success) {
                dispatch(setUserProfile(profileResponse.data));
                console.log("User profile initialized successfully.");
            } else {
                dispatch(showAlert({
                    type: 'error',
                    title: 'Profile Error',
                    message: profileResponse.message || "Failed to fetch user profile."
                }));
            }

            // Fetch notifications
            try {
                await dispatch(fetchNotifications()); // Dispatch the fetchNotifications action
                console.log("Notifications fetched successfully.");
            } catch (error) {
                console.error("Error fetching notifications:", error);
                dispatch(showAlert({
                    type: 'error',
                    title: 'Sync Error',
                    message: "Failed to sync notifications."
                }));
            }
        }
        return true; // Initialization successful
    } catch (error) {
        console.error("Initialization error:", error);
        dispatch(showAlert({
            type: 'error',
            title: 'Init Error',
            message: "An error occurred during system initialization."
        }));
        return false; // Initialization failed
    }
}

export default AppInit;
