import React, {useEffect, useState} from 'react';
import styles from '../styles/loginPage.module.css';
import axios from "../axiosInstance.js";
import {handleError} from "../handlers/handleError.js";

const ResetPasswordPage = () => {

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: ''
    });

    const [token, setToken] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const extractedToken = params.get('token');
        setToken(extractedToken);
    }, []);

    const validateField = (name, value) => {
        if (name === 'password') {
            if (!value.trim()) return 'Field is required';
            if (value.length < 8) return 'Password must be at least 8 characters';
        }
        if (name === 'confirmPassword') {
            if (value !== formData.password) return 'Passwords do not match';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, value)
        }));

        if (name === 'password') {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: validateField('confirmPassword', formData.confirmPassword)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            console.log(formData.get("password"))
            const res = await axios.post(`/auth/password-reset/reset?token=${token}`, { password: formData.get("password") });
            alert(res.data + ". You will be redirected to login page in 5 seconds.");
        } catch (error) {
            handleError(error, "Validation errors");
        } finally {
            setTimeout(() => {
                window.location.href = '/auth';
            }, 5000);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 style={{textAlign:"center",color: "black", fontWeight:"bold"}}>Reset Password</h2>
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={styles.formInput}
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={styles.formInput}
                        />
                        {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                    </div>
                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={!!errors.password || !!errors.confirmPassword}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
