import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isLoading: false,
    isPasswordLoading: false,
    error: null,
    success: null,
    profilePicture: null,
    imagePreview: null,
    showWelcome: true, // Add showWelcome to the state
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        // Profile fetch reducers
        fetchProfileStart(state) {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        fetchProfileSuccess(state, action) {
            state.isLoading = false;
            state.user = action.payload;
            state.profilePicture = action?.payload?.profile_picture || null;
        },
        fetchProfileFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Profile update reducers
        updateProfileStart(state) {
            state.isLoading = true;
            state.error = null;
            state.success = null;
        },
        updateProfileSuccess(state, action) {
            state.isLoading = false;
            state.user = { ...state.user, ...action?.payload }; // Merge existing and updated data
            state.profilePicture = action?.payload?.profile_picture || state?.profilePicture; // Keep or update the profile picture
            state.success = "Profile updated successfully.";
        },
        updateProfileFailure(state, action) {
            state.isLoading = false;
            state.error = action.payload;
        },

        // Handle image upload and preview
        setImagePreview(state, action) {
            state.imagePreview = action.payload;
        },

        // Password change reducers
        changePasswordStart(state) {
            state.isPasswordLoading = true;
            state.error = null;
            state.success = null;
        },
        changePasswordSuccess(state, action) {
            state.isPasswordLoading = false;
            state.success = action.payload || "Password updated successfully.";
        },
        changePasswordFailure(state, action) {
            state.isPasswordLoading = false;
            state.error = action.payload;
        },

        clearProfileState(state) {
            state.error = null;
            state.success = null;
        },
        // Toggle Welcome State
        toggleWelcomeState(state) {
            state.showWelcome = !state.showWelcome;
        },

        // Set Welcome State
        setWelcomeState(state, action) {
            state.showWelcome = action.payload;
        },
    },
});

export const {
    fetchProfileStart,
    fetchProfileSuccess,
    fetchProfileFailure,
    updateProfileStart,
    updateProfileSuccess,
    updateProfileFailure,
    setImagePreview,
    changePasswordStart,
    changePasswordSuccess,
    changePasswordFailure,
    clearProfileState,
    toggleWelcomeState,
    setWelcomeState,
} = profileSlice.actions;

export default profileSlice.reducer;
