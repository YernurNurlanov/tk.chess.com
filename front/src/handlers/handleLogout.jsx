import axios from "../axiosInstance.js";
import {handleError} from "./handleError.js";

export const handleLogout = async () => {
    try {
        await axios.get(`/auth/logout`);
        window.location.href = "/auth";
    } catch (error) {
        handleError(error, "Logout error");
    }
};