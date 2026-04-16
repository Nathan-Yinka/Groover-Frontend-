import { toast } from "sonner";

/**
 * Handles errors from API responses and displays them using toasts.
 * Supports strings, arrays, and objects of arrays.
 *
 * @param {any} error - The error object or message to process.
 */
const ErrorHandler = (error) => {
    const errorMessage =
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "An unexpected error occurred.";
        console.log("fkjfjkfjkjgf",error.response?.data?.message)
        console.log("errorMessage",errorMessage)
    // console.log("rnfjknfrnjkerf", errorMessage)
    if (typeof errorMessage === "string") {
        // If the error is a simple string
        toast.error(errorMessage);
    } else if (Array.isArray(errorMessage)) {
        // If the error is an array of messages
        errorMessage.forEach((msg) => toast.error(msg));
    } else if (typeof errorMessage === "object") {
        // If the error is an object with potential arrays
        Object.keys(errorMessage).forEach((field) => {
            if (Array.isArray(errorMessage[field])) {
                errorMessage[field].forEach((msg) => toast.error(msg));
            } else {
                toast.error(errorMessage[field]);
            }
        });
    } else {
        // Fallback for unexpected formats
        toast.error("An unexpected error occurred.");
    }
};

export default ErrorHandler;
