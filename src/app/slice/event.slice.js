import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events: [], // Stores the fetched events
    isLoading: false, // Loading state for fetching events
    error: null, // Stores any errors encountered during fetching
};

const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        // Fetch Events Reducers
        fetchEventsStart(state) {
            state.isLoading = true; // Set loading state to true
            state.error = null; // Reset errors
        },
        fetchEventsSuccess(state, action) {
            state.isLoading = false; // Loading complete
            // console.log(action.payload)
            state.events = action.payload; // Populate state with fetched events
            state.error = null; // Clear errors
        },
        fetchEventsFailure(state, action) {
            state.isLoading = false; // Loading complete, even if there’s an error
            state.error = action.payload; // Store the error message
        },

        // Clear Error Messages
        clearEventState(state) {
            state.error = null; // Clear any error messages
        },
    },
});

// Exporting the actions
export const {
    fetchEventsStart,
    fetchEventsSuccess,
    fetchEventsFailure,
    clearEventState,
} = eventSlice.actions;

// Exporting the reducer
export default eventSlice.reducer;
