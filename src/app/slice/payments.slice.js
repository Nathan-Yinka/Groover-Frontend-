import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null, // Stores payment data fetched from the API
    isLoading: false,
    error: null,
    success: null,
};

const paymentsSlice = createSlice({
    name: "payments",
    initialState,
    reducers: {
        // Start fetching payment method
        fetchPaymentStart(state) {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        // Successfully fetched payment method
        fetchPaymentSuccess(state, action) {
            state.isLoading = false;
            state.data = action.payload; // Store the fetched data in the state
            state.error = null;
        },
        // Failed to fetch payment method
        fetchPaymentFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Start posting payment method
        postPaymentStart(state) {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        // Successfully posted payment method
        postPaymentSuccess(state, action) {
            state.isLoading = false;
            state.success = action.payload; // Store the success message
        },
        // Failed to post payment method
        postPaymentFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Clear error and success messages
        clearPaymentsState(state) {
            state.error = null;
            state.success = null;
        },
    },
});

export const {
    fetchPaymentStart,
    fetchPaymentSuccess,
    fetchPaymentFailure,
    postPaymentStart,
    postPaymentSuccess,
    postPaymentFailure,
    clearPaymentsState,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
