import axiosInstance from "../axiosConfig";
import { fetchPacksStart, fetchPacksSuccess, fetchPacksFailure } from "../slice/packs.slice";
import { packsAPI } from "../../constants/api.routes";

export const fetchActivePacks = () => async (dispatch) => {
    dispatch(fetchPacksStart());

    try {
        const response = await axiosInstance.get(packsAPI);
        dispatch(fetchPacksSuccess(response.data)); // Assuming the response data is the list of packs
        console.log(response.data)
        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Failed to fetch packs.";
        dispatch(fetchPacksFailure(errorMessage));
        return { success: false, message: error };
    }
};
