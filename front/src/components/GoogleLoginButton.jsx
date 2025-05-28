import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from "../axiosInstance.js";
import {handleError} from "../handlers/handleError.js";
import {useNavigate} from "react-router-dom";

export default function GoogleLoginButton() {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;

        try {
            const res = await axios.post(`/auth/google`, {
                idToken: idToken,
            });
            switch (res.data.role) {
                case 'ROLE_ADMIN':
                    navigate('/admin');
                    break;
                case 'ROLE_TEACHER':
                    navigate('/teacher');
                    break;
                case 'ROLE_STUDENT':
                    navigate('/student');
                    break;
                default:
                    navigate('/');
            }
        } catch (error) {
            handleError(error, "Validation errors");
        }
    };

    return (
        <GoogleLogin onSuccess={handleSuccess} onError={() => handleError("", "Ошибка")} />
    );
}
