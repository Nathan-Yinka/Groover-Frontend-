import React, { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { toast } from "sonner";
import { fetchSettingsFailure, fetchSettingsStart, fetchSettingsSuccess } from "../../app/slice/auth.slice";
import authService from "../../app/service/auth.service";
import ErrorHandler from "../../app/ErrorHandler";

const TawkTo = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state) => state.auth.settings);

    useEffect(() => {
        const fetchSettings = async () => {
            if (!settings) {
                dispatch(fetchSettingsStart());
                try {
                    const response = await authService.fetchSettings();
                    if (response.success) {
                        dispatch(fetchSettingsSuccess(response.data));
                    } else {
                        dispatch(fetchSettingsFailure(response.message || "Failed to load profile."));
                        ErrorHandler(response.message);
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    dispatch(fetchSettingsFailure("An error occurred while fetching your profile."));
                    // toast.error("An error occurred while fetching your profile.");
                    ErrorHandler(error)
                }
            }
        };

        fetchSettings();
    }, [dispatch, settings]);

    useEffect(() => {
        if (settings?.online_chat_url) {
        const script = document.createElement("script");
        script.async = true;
        script.src = settings?.online_embed_url;
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");

        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(script, firstScriptTag);

        // Cleanup to prevent duplicate scripts
        return () => {
            script.remove();
        };
        }
    }, [settings?.online_chat_url]);

    return null; // This component does not render anything
};



export default TawkTo;
