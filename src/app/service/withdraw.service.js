import { fetchWithdrawals, makeWithdrawals } from "../../constants/api.routes";
import axiosInstance from "../axiosConfig";
import {
    fetchWithdrawalsStart,
    fetchWithdrawalsSuccess,
    fetchWithdrawalsFailure,
    makeWithdrawalStart,
    makeWithdrawalSuccess,
    makeWithdrawalFailure,
} from "../slice/withdraw.slice";

import { toast } from "sonner"; // For notifications

/**
 * Fetch Withdrawal History
 */
export const fetchWithdrawalHistory = () => async (dispatch) => {
    dispatch(fetchWithdrawalsStart());
    try {
        const response = await axiosInstance.get(fetchWithdrawals);
        if (response.data.success) {
            dispatch(fetchWithdrawalsSuccess(response.data.data));
        } else {
            const errorMessage = response.data.message || "Failed to fetch withdrawal history.";
            dispatch(fetchWithdrawalsFailure(errorMessage));
            toast.error(errorMessage);
        }
    } catch (error) {
        console.error("Error fetching withdrawal history:", error);
        const errorMessage = error.response?.data?.message || "An error occurred while fetching withdrawal history.";
        dispatch(fetchWithdrawalsFailure(errorMessage));
        toast.error(errorMessage);
    }
};

/**
 * Make Withdrawal
 */
export const makeWithdrawal = (payload) => async (dispatch) => {
    dispatch(makeWithdrawalStart());
    try {
        const response = await axiosInstance.post(makeWithdrawals, payload);
        if (response.data.success) {
            dispatch(makeWithdrawalSuccess(response.data.message));
            toast.success(response.data.message || "Withdrawal request successful.");
            return { success: true, message: response.data.message };
        } else {
            // Extract error message
            const errorMessage =
                response.data.message?.error?.[0] || // Check nested `message.error`
                response.data.message || // Fallback to `message`
                "Failed to make withdrawal."; // Fallback error message

            dispatch(makeWithdrawalFailure(errorMessage));
            // toast.error(errorMessage);
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error("Error making withdrawal:", error);

        // Handle network or unexpected errors
        const errorMessage =
            error.response?.data?.message?.error?.[0] || // Check nested `message.error`
            error.response?.data?.message || // Fallback to `message`
            "An error occurred while making withdrawal."; // Fallback error message

        dispatch(makeWithdrawalFailure(errorMessage));
        // toast.error(errorMessage);
        return { success: false, message: error };
    }
};

