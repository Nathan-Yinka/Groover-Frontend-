import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        gameRecords: [], // New state for game records
        currentGame: null, // Store the current game data
        isLoading: false,
        isLoading_current: false,
        error: null,
        error_msg: null,
    },
    reducers: {
        // Existing reducers
        fetchProductsStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchProductsSuccess(state, action) {
            state.isLoading = false;
            state.products = action.payload || []; // Store products
        },
        fetchProductsFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload; // Store error
        },

        // New reducers for currentGame
        fetchCurrentGameStart(state) {
            state.isLoading_current = true;
            state.error = null;
        },
        fetchCurrentGameSuccess(state, action) {
            state.isLoading_current = false;
            state.currentGame = action.payload || null; // Store current game data
            state.error_msg = action.payload.message
        },
        fetchCurrentGameFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload; // Store error
        },

        // Reducer for submitting a game (playGame)
        playGameStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        playGameSuccess(state, action) {
            state.isLoading = false;
            state.currentGame = null; // Update current game data after submission
        },
        playGameFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload; // Store error
        },

        fetchGameRecordsStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchGameRecordsSuccess(state, action) {
            state.isLoading = false;
            state.gameRecords = action.payload || []; // Store game records
        },
        fetchGameRecordsFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload; // Store error
        },
    },
});

export const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchCurrentGameStart,
    fetchCurrentGameSuccess,
    fetchCurrentGameFailure,
    playGameStart,
    playGameSuccess,
    playGameFailure,
    fetchGameRecordsStart,
    fetchGameRecordsSuccess,
    fetchGameRecordsFailure,
} = productSlice.actions;

export default productSlice.reducer;
