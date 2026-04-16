import axiosInstance from "../axiosConfig";
import { productsAPI, currentGame, playGame, gameRecord } from "../../constants/api.routes";
import {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchCurrentGameStart,
    fetchCurrentGameSuccess,
    // fetchCurrentGameFailure,
    playGameStart,
    playGameSuccess,
    playGameFailure,
    fetchGameRecordsStart, // New actions for game records
    fetchGameRecordsSuccess,
    fetchGameRecordsFailure,
} from "../slice/product.slice";
import { fetchProfileFailure, fetchProfileStart, fetchProfileSuccess } from "../slice/profile.slice";
import authService from "./auth.service";

// Fetch Products
export const fetchProducts = () => async (dispatch) => {
    dispatch(fetchProductsStart());

    try {
        const response = await axiosInstance.get(productsAPI);
        const products = response.data?.data || [];
        dispatch(fetchProductsSuccess(products));
        console.log(products);
        return { success: true, data: products };
    } catch (error) {
        const errorMessage =
            error.response?.data?.message || "Failed to fetch products.";
        dispatch(fetchProductsFailure(errorMessage));
        return { success: false, message: errorMessage };
    }
};

// Fetch Current Game
export const fetchCurrentGame = () => async (dispatch) => {
    dispatch(fetchCurrentGameStart());

    try {
        const response = await axiosInstance.get(currentGame);
        const gameData = response.data?.data || null;
        dispatch(fetchCurrentGameSuccess(gameData));
        console.log(gameData);
        return { success: true, data: gameData };
    } catch (error) {
        const errorMessage =
            error.response?.data?.data
        errorMessage["message"] = error.response?.data?.message
        dispatch(fetchCurrentGameSuccess(errorMessage));
        return { success: false, message: errorMessage };
    }
};

// Submit Current Game (Play Game)
export const submitCurrentGame = (ratingScore, comment) => async (dispatch) => {
    console.log("Submitting game with:", { ratingScore, comment }); // Debug log

    dispatch(playGameStart());

    try {
        const response = await axiosInstance.post(playGame, {
            rating_score: ratingScore,
            comment,
        });

        console.log("API Response:", response.data); // Debug log
        const updatedGameData = response.data?.data || null;
        const response2 = await authService.fetchProfile();
        dispatch(fetchProfileSuccess(response2.data));
        dispatch(fetchProfileStart());
        dispatch(playGameSuccess(updatedGameData));
        return { success: true, data: updatedGameData };
    } catch (error) {
        console.error("API Error:", error); // Debug log
        const errorMessage =
            error.response?.data?.message || "Failed to submit the game.";
        dispatch(playGameFailure(errorMessage));
        return { success: false, message: error };
    }
};

// Fetch Game Records
export const fetchGameRecords = () => async (dispatch) => {
    dispatch(fetchGameRecordsStart());

    try {
        const response = await axiosInstance.get(gameRecord);
        const records = response.data?.data || [];
        dispatch(fetchGameRecordsSuccess(records));
        console.log("Game Records Fetched:", records); // Debug log
        return { success: true, data: records };
    } catch (error) {
        console.error("Error Fetching Game Records:", error); // Debug log
        const errorMessage =
            error.response?.data?.message || "Failed to fetch game records.";
        dispatch(fetchGameRecordsFailure(errorMessage));
        return { success: false, message: error };
    }
};