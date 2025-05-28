import axios from "axios";
import {handleLogout} from "./handlers/handleLogout.jsx";

const url = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: url,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            handleLogout().then()
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
