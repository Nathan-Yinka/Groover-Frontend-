import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

const initialState = {
    notifications: [], // Stores the fetched notifications
    isLoading: false, // Loading state for fetching or updating
    error: null, // Stores any errors encountered
    success: null, // Stores success messages
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        // Fetch Notifications Reducers
        fetchNotificationsStart(state) {
            // state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        fetchNotificationsSuccess(state, action) {
            // state.isLoading = false;
            state.notifications = action.payload; // Populate with fetched data
            state.error = null;
        },
        fetchNotificationsFailure(state, action) {
            // state.isLoading = false;
            state.error = action.payload; // Store error message
        },

        // Mark Notification as Read Reducers
        markNotificationReadStart(state) {
            // state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        markNotificationReadSuccess(state, action) {
            // state.isLoading = false;
            state.success = action.payload.message; // Store success message
            state.notifications = state.notifications.map((notification) =>
                notification.id === action.payload.data.id ? action.payload.data : notification,
                toast.success("Marked read successfully")
            ); // Update the specific notification
        },
        markNotificationReadFailure(state, action) {
            // state.isLoading = false;
            state.error = action.payload; // Store error message
        },

        // Mark All Notifications as Read Reducers
        markAllNotificationsReadStart(state) {
            // state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        markAllNotificationsReadSuccess(state, action) {
            // state.isLoading = false;
            state.success = action.payload.message; // Store success message
            state.notifications = state.notifications.map((notification) => ({
                ...notification,
                is_read: true,
            })); // Mark all as read
            toast.success("Marked read successfully")
        },
        markAllNotificationsReadFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload; // Store error message
        },

        // Clear Error and Success Messages
        clearNotificationsState(state) {
            state.error = null;
            state.success = null;
        },
    },
});

export const {
    fetchNotificationsStart,
    fetchNotificationsSuccess,
    fetchNotificationsFailure,
    markNotificationReadStart,
    markNotificationReadSuccess,
    markNotificationReadFailure,
    markAllNotificationsReadStart,
    markAllNotificationsReadSuccess,
    markAllNotificationsReadFailure,
    clearNotificationsState,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
