import authService from "./service/auth.service";
import { setUserProfile } from "./slice/auth.slice";
import { fetchNotifications } from "./service/notifications.service"; // Import the fetchNotifications action
import { toast } from "sonner";

async function AppInit({ dispatch, isAuthenticated }) {
    try {
        if (isAuthenticated) {
            // Fetch the user profile
            const profileResponse = await authService.fetchProfile();
            if (profileResponse.success) {
                dispatch(setUserProfile(profileResponse.data));
                console.log("User profile initialized successfully.");
            } else {
                toast.error(profileResponse.message || "Failed to fetch user profile.");
            }

            // Fetch notifications
            try {
                await dispatch(fetchNotifications()); // Dispatch the fetchNotifications action
                console.log("Notifications fetched successfully.");
            } catch (error) {
                console.error("Error fetching notifications:", error);
                toast.error("Failed to fetch notifications.");
            }
        }
        return true; // Initialization successful
    } catch (error) {
        console.error("Initialization error:", error);
        toast.error("An error occurred during initialization. Please try again.");
        return false; // Initialization failed
    }
}

export default AppInit;
