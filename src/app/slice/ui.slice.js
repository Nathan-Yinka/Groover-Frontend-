import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    alert: {
        visible: false,
        type: 'info', // 'success' | 'error' | 'sync' | 'info'
        title: '',
        message: ''
    }
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        showAlert(state, action) {
            state.alert = {
                visible: true,
                type: action.payload.type || 'info',
                title: action.payload.title || 'System Message',
                message: action.payload.message || ''
            };
        },
        hideAlert(state) {
            state.alert.visible = false;
        }
    },
});

export const { showAlert, hideAlert } = uiSlice.actions;
export default uiSlice.reducer;
