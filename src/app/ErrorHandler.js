import store from "./store";
import { showAlert } from "./slice/ui.slice";

/**
 * Handles errors from API responses and displays them using the Global Terminal HUD.
 * @param {any} error - The error object from Axios or other sources.
 */
const ErrorHandler = (error) => {
    let title = "System Error";
    let message = "An unexpected error occurred. Please try again.";

    // 1. Check for specific Axios Error types
    if (error?.code === 'ECONNABORTED' || error?.message?.toLowerCase().includes('timeout')) {
        title = "Connection Timeout";
        message = "Server response timed out. Please check your connection.";
    } 
    else if (error?.message === 'Network Error') {
        title = "Network Failure";
        message = "Unable to reach the server. Please verify your internet access.";
    }
    // 2. Extract structured errors from Response Data (if available)
    else if (error?.response?.data) {
        const data = error.response.data;
        
        // Handle Django/Common REST frameworks structures
        if (typeof data === 'string') {
            message = data;
        } else if (data.detail) {
            message = data.detail;
        } else if (data.message) {
            message = data.message;
        } else if (data.error) {
            message = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
        } else if (data.errors) {
            // If it's a validation error object (key-value pairs)
            const errorList = Object.values(data.errors).flat();
            message = errorList.join(' | ');
        } else {
            // Fallback for objects - extract values but keep it flat
            const values = Object.values(data).filter(v => typeof v === 'string');
            if (values.length > 0) message = values.join(' | ');
        }
    } 
    // 3. Last resort - use the raw error message if it's simple
    else if (error?.message && typeof error.message === 'string' && error.message.length < 100) {
        message = error.message;
    }

    // DISPATCH TO GLOBAL TERMINAL HUD
    store.dispatch(showAlert({
        type: 'error',
        title: title,
        message: message
    }));

    return [message];
};

export default ErrorHandler;
