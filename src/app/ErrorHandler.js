import store from "./store";
import { showAlert } from "./slice/ui.slice";

/**
 * Handles errors from API responses and displays them using the Global Terminal HUD.
 * @param {any} error - The error object from Axios or other sources.
 */
const ErrorHandler = (error) => {
    let title = "Error";
    let message = "Something went wrong. Please try again.";

    // 1. Check for specific Axios Error types
    if (error?.code === 'ECONNABORTED' || error?.message?.toLowerCase().includes('timeout')) {
        title = "Connection Timeout";
        message = "The server took too long to respond. Please check your connection.";
    }
    else if (error?.message === 'Network Error') {
        title = "Network Error";
        message = "We couldn't reach the server. Please check your internet connection.";
    }
    // 2. Extract structured errors from Response Data (if available)
    else if (error?.response?.data) {
        const data = error.response.data;

        // Handle Django/Common REST frameworks structures
        if (typeof data === 'string') {
            message = data;
        } else if (data.detail) {
            message = data.detail;
        } else if (data.message && typeof data.message === 'string') {
            message = data.message;
        } else if (data.message && typeof data.message === 'object') {
            // DRF validation errors keyed by field name, e.g.
            // { username_or_email: ["Invalid credentials."] }
            message = Object.values(data.message).flat();
        } else if (data.error) {
            message = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        } else if (data.errors) {
            // If it's a validation error object (key-value pairs), keep each
            // one as its own line instead of cramming them into one sentence.
            message = Object.values(data.errors).flat();
        } else {
            // Fallback for objects - extract values but keep it flat
            const values = Object.values(data).filter(v => typeof v === 'string');
            if (values.length > 0) message = values;
        }
    }
    // 3. Last resort - use the raw error message if it's simple
    else if (error?.message && typeof error.message === 'string' && error.message.length < 100) {
        message = error.message;
    }

    // DISPATCH TO THE TOAST
    store.dispatch(showAlert({
        type: 'error',
        title: title,
        message: message
    }));

    return [message];
};

export default ErrorHandler;
