import { passwordAPI, updateAPI, transactionPasswordAPI } from "../../constants/api.routes";
import axiosInstance from "../axiosConfig";
import {
    updateProfileStart,
    updateProfileSuccess,
    updateProfileFailure,
    changePasswordStart,
    changePasswordSuccess,
    changePasswordFailure,
} from "../slice/profile.slice";

// Update Profile Service
export const updateProfile = (data) => async (dispatch) => {
    dispatch(updateProfileStart());

    try {
        const formData = new FormData();

        // Append only changed fields to FormData
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        const response = await axiosInstance.patch(updateAPI, formData); // Let Axios handle Content-Type
        dispatch(updateProfileSuccess(response.data));
        return { success: true, message: "Profile updated successfully." };
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to update profile.";
        dispatch(updateProfileFailure(errorMessage));
        return { success: false, message: error };
    }
};

// Change Password Service
export const changePassword = (data) => async (dispatch) => {
    dispatch(changePasswordStart());
    try {
        const response = await axiosInstance.post(passwordAPI, data); // Use imported passwordAPI
        dispatch(changePasswordSuccess(response.data.message)); // Dispatch success with message
        return { success: true, message: "Password updated successfully." };
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to change password.";
        dispatch(changePasswordFailure(errorMessage)); // Dispatch failure with error message
        return { success: false, message: error };
    }
};

// Change Transaction Password Service
export const changeTransactionPassword = (data) => async (dispatch) => {
    dispatch(changePasswordStart()); // Reuse the same action for password loading state
    try {
        const response = await axiosInstance.post(transactionPasswordAPI, data); // Use the new endpoint
        dispatch(changePasswordSuccess(response.data.message)); // Dispatch success with the message
        return { success: true, message: "Transaction password updated successfully." };
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to change transaction password.";
        dispatch(changePasswordFailure(errorMessage)); // Dispatch failure with the error message
        return { success: false, message: error };
    }
};