import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppInit from "../app/state.helper";
import authService from "../app/service/auth.service"; // Ensure authService is imported
import { home, login } from "../constants/app.routes";
import { toast } from "sonner";

import Load from "./dashboard/components/Load";

const Loader = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("accessToken");

            if (token) {
                try {
                    const refreshResponse = await authService.refreshAccessToken();
                    if (refreshResponse.success) {
                        await AppInit({ dispatch, isAuthenticated: true });
                        navigate(home);
                    } else {
                        toast.error("Session expired. Please log in.");
                        navigate(login);
                    }
                } catch (error) {
                    console.error("Error during authentication:", error);
                    toast.error("An error occurred. Please log in again.");
                    navigate(login);
                }
            } else {
                navigate(login);
            }
        };

        checkAuth();
    }, [dispatch, navigate]);

    return (
        <Load fullScreen={true} size="large" />
    );
};

export default Loader;
