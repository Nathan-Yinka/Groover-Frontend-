import axiosInstance from "../axiosConfig";
import { depositsAPI } from "../../constants/api.routes";
import {
    fetchDepositsStart,
    fetchDepositsSuccess,
    fetchDepositsFailure,
    submitDepositStart,
    submitDepositSuccess,
    submitDepositFailure,
} from "../slice/deposit.slice";

// Fetch Deposits Service
export const fetchDeposits = () => async (dispatch) => {
    dispatch(fetchDepositsStart());

    try {
        const response = await axiosInstance.get(depositsAPI);
        const deposits = response.data?.data || [];
        dispatch(fetchDepositsSuccess(deposits));
        // console.log(deposits)
        return { success: true, data: deposits };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch deposits.";
        dispatch(fetchDepositsFailure(errorMessage));
        return { success: false, message: errorMessage };
    }
};

// Submit Deposit Service
export const submitDeposit = (formData) => async (dispatch) => {
    dispatch(submitDepositStart());

    try {
        const response = await axiosInstance.post(depositsAPI, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const newDeposit = response.data?.data; // Extract the new deposit
        dispatch(submitDepositSuccess({ data: newDeposit, message: response.data?.message }));
        return { success: true, data: newDeposit };
    } catch (error) {
        const errorMessage = error.response?.data || "An unexpected error occurred.";
        dispatch(submitDepositFailure(errorMessage));
        return { success: false, message: error };
    }
};
