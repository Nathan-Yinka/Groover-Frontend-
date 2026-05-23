import axiosInstance from "../axiosConfig";
import { pendingBonusAPI, respondBonusAPI } from "../../constants/api.routes";

const bonusService = {
    fetchPendingBonus: async () => {
        try {
            const response = await axiosInstance.get(pendingBonusAPI);
            return { success: true, data: response.data?.data || null };
        } catch (error) {
            return { success: false, message: error };
        }
    },

    respondToBonus: async (bonusId, action) => {
        try {
            const response = await axiosInstance.post(respondBonusAPI(bonusId), {
                action,
            });
            return {
                success: true,
                data: response.data?.data,
                message: response.data?.message,
            };
        } catch (error) {
            return { success: false, message: error };
        }
    },
};

export default bonusService;
