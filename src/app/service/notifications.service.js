import { markallRead, markRead, notificationsAPI } from "../../constants/api.routes";
import axiosInstance from "../axiosConfig";
import {
    fetchNotificationsStart,
    fetchNotificationsSuccess,
    fetchNotificationsFailure,
    markNotificationReadStart,
    markNotificationReadSuccess,
    markNotificationReadFailure,
    markAllNotificationsReadStart,
    markAllNotificationsReadSuccess,
    markAllNotificationsReadFailure,
} from "../slice/notifications.slice";

export const fetchNotifications = () => async (dispatch) => {
    dispatch(fetchNotificationsStart());
    try {
        const response = await axiosInstance.get(notificationsAPI);
        if (response.data.success) {
            dispatch(fetchNotificationsSuccess(response.data.data));
        } else {
            dispatch(fetchNotificationsFailure(response.data.message || "Failed to fetch notifications."));
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while fetching notifications.";
        dispatch(fetchNotificationsFailure(errorMessage));
    }
};

export const markNotificationAsRead = (notificationId) => async (dispatch) => {
    dispatch(markNotificationReadStart());
    try {
        const response = await axiosInstance.post(markRead, {
            notification_id: notificationId,
        });
        if (response.data.success) {
            dispatch(markNotificationReadSuccess(response.data));
        } else {
            dispatch(markNotificationReadFailure(response.data.message || "Failed to mark notification as read."));
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while marking notification as read.";
        dispatch(markNotificationReadFailure(errorMessage));

    }
};

export const markAllNotificationsAsRead = () => async (dispatch) => {
    dispatch(markAllNotificationsReadStart());
    try {
        const response = await axiosInstance.post(markallRead, {});
        if (response.data.success) {
            dispatch(markAllNotificationsReadSuccess(response.data));
        } else {
            dispatch(markAllNotificationsReadFailure(response.data.message || "Failed to mark all as read."));
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while marking all as read.";
        dispatch(markAllNotificationsReadFailure(errorMessage));
    }
};
