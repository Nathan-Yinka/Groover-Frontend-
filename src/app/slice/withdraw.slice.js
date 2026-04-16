import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    history: [], // Stores withdrawal history
    isLoading: false, // Loading state for fetching or posting
    error: null, // Stores any errors encountered
    success: null, // Stores success messages
};

const withdrawSlice = createSlice({
    name: "withdrawals",
    initialState,
    reducers: {
        // Fetch Withdrawals History Reducers
        fetchWithdrawalsStart(state) {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        fetchWithdrawalsSuccess(state, action) {
            state.isLoading = false;
            state.history = action.payload; // Populate history with fetched data
            state.error = null;
        },
        fetchWithdrawalsFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload; // Store error message
        },

        // Make Withdrawal Reducers
        makeWithdrawalStart(state) {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        makeWithdrawalSuccess(state, action) {
            state.isLoading = false;
            state.success = action.payload; // Store success message
            state.error = null;
        },
        makeWithdrawalFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload; // Store error message
        },

        // Clear Error and Success Messages
        clearWithdrawalsState(state) {
            state.error = null;
            state.success = null;
        },
    },
});

export const {
    fetchWithdrawalsStart,
    fetchWithdrawalsSuccess,
    fetchWithdrawalsFailure,
    makeWithdrawalStart,
    makeWithdrawalSuccess,
    makeWithdrawalFailure,
    clearWithdrawalsState,
} = withdrawSlice.actions;

export default withdrawSlice.reducer;
