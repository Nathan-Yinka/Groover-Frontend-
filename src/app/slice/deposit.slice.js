import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    deposits: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    successMessage: null,
};

const depositSlice = createSlice({
    name: "deposit",
    initialState,
    reducers: {
        fetchDepositsStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchDepositsSuccess(state, action) {
            state.isLoading = false;
            state.deposits = action.payload;
        },
        fetchDepositsFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        submitDepositStart(state) {
            state.isSubmitting = true;
            state.error = null;
            state.successMessage = null;
        },
        submitDepositSuccess(state, action) {
            state.isSubmitting = false;
            state.successMessage = action.payload.message || "Deposit submitted successfully.";
            // Add the new deposit to the list
            if (action.payload.data) {
                state.deposits.unshift(action.payload.data); // Add new deposit to the top
            }
        },
        submitDepositFailure(state, action) {
            state.isSubmitting = false;
            state.error = action.payload;
        },
        clearDepositState(state) {
            state.error = null;
            state.successMessage = null;
        },
    },
});

export const {
    fetchDepositsStart,
    fetchDepositsSuccess,
    fetchDepositsFailure,
    submitDepositStart,
    submitDepositSuccess,
    submitDepositFailure,
    clearDepositState,
} = depositSlice.actions;

export default depositSlice.reducer;
