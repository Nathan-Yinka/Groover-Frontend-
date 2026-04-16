import { eventAPI } from "../../constants/api.routes";
import axiosInstance from "../axiosConfig";
import {
    fetchEventsStart,
    fetchEventsSuccess,
    fetchEventsFailure,
} from "../slice/event.slice";

export const fetchEvents = () => async (dispatch) => {
    dispatch(fetchEventsStart());
    try {
        const response = await axiosInstance.get(eventAPI); // Replace `eventAPI` with your actual endpoint
        if (response.data.success) {
            dispatch(fetchEventsSuccess(response.data.data)); // Dispatch the success action with event data
        } else {
            dispatch(fetchEventsFailure(response.data.message || "Failed to fetch events."));
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while fetching events.";
        dispatch(fetchEventsFailure(errorMessage)); // Dispatch the failure action with error message
    }
};
