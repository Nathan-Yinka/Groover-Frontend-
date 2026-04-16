import axiosInstance from "../axiosConfig";
import {
    fetchPaymentStart,
    fetchPaymentSuccess,
    fetchPaymentFailure,
    postPaymentStart,
    postPaymentSuccess,
    postPaymentFailure,
} from "../slice/payments.slice";
import { paymentsAPI } from "../../constants/api.routes";

const paymentsService = {
    /**
     * Fetches the payment method details.
     */
    fetchPaymentMethod: async (dispatch) => {
        dispatch(fetchPaymentStart());
        try {
            const response = await axiosInstance.get(paymentsAPI); // Send GET request to fetch payment method
            if (response.data.success) {
                dispatch(fetchPaymentSuccess(response.data.data)); // Dispatch success with the fetched data
                return { success: true, data: response.data.data };
            } else {
                const errorMessage = response.data.message || "Failed to fetch payment method.";
                dispatch(fetchPaymentFailure(errorMessage));
                return { success: false, message: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while fetching payment data.";
            dispatch(fetchPaymentFailure(errorMessage));
            return { success: false, message: errorMessage };
        }
    },

    /**
     * Posts the updated payment method details.
     */
    postPaymentMethod: async (dispatch, payload) => {
        dispatch(postPaymentStart());
        try {
            const response = await axiosInstance.post(paymentsAPI, payload); // Send POST request to update payment method
            if (response.data.success) {
                dispatch(postPaymentSuccess(response.data.message)); // Dispatch success with success message
                return { success: true, message: response.data.message };
            } else {
                const errorMessage = response.data.message || "Failed to update payment method.";
                dispatch(postPaymentFailure(errorMessage));
                return { success: false, message: errorMessage };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred while updating payment data.";
            dispatch(postPaymentFailure(errorMessage));
            return { success: false, message: error };
        }
    },
};

export default paymentsService;
