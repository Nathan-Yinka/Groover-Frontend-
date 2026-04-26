import store from "./store";
import { showAlert } from "./slice/ui.slice";

/**
 * Recursively extracts all string values from an object or array.
 * @param {any} obj - The object to search.
 * @param {string[]} acc - Accumulator for strings.
 */
const extractMessages = (obj, acc) => {
    if (!obj) return;
    if (typeof obj === "string") {
        acc.push(obj);
    } else if (Array.isArray(obj)) {
        obj.forEach(item => extractMessages(item, acc));
    } else if (typeof obj === "object") {
        // Prioritize common error keys first to keep them at the top
        const priorities = ['errors', 'message', 'msg', 'detail', 'error'];
        priorities.forEach(key => {
            if (obj[key]) extractMessages(obj[key], acc);
        });

        // Then check everything else
        Object.keys(obj).forEach(key => {
            if (!priorities.includes(key)) {
                extractMessages(obj[key], acc);
            }
        });
    }
};

/**
 * Handles errors from API responses and displays them using the Global Terminal HUD.
 * @param {any} error - The error object or message to process.
 * @returns {string[]} Array of extracted error messages.
 */
const ErrorHandler = (error) => {
    const messages = [];

    // Layered extraction: Check body, check config, check raw error
    const errorBody = error?.response?.data || error?.message?.response?.data || error?.data || error;
    
    extractMessages(errorBody, messages);

    // Filter and deduplicate
    const cleanMessages = [...new Set(messages)].filter(m => typeof m === 'string' && m.length > 3);

    if (cleanMessages.length === 0) {
        cleanMessages.push("An unexpected error occurred.");
    }

    // DISPATCH TO GLOBAL TERMINAL HUD
    const combinedMessage = cleanMessages.join(' | ');
    store.dispatch(showAlert({
        type: 'error',
        title: 'Error',
        message: combinedMessage
    }));

    return cleanMessages;
};

export default ErrorHandler;
