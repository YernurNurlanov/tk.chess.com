import React, { useState } from 'react';
import styles from '../styles/loginPage.module.css';
import axios from "../axiosInstance.js";
import { handleError } from "../handlers/handleError.js";

const ForcePasswordChangePage = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        password: '',
        confirmPassword: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

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

        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));

        if (name === 'password') {
            setErrors(prev => ({
                ...prev,
                confirmPassword: validateField('confirmPassword', formData.confirmPassword)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            await axios.put("/me/change-password", {
                password: formData.get("password")
            });
            setSubmitted(true);
            setTimeout(() => {
                window.location.href = "/auth";
            }, 3000);
        } catch (error) {
            handleError(error, "Password change failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 style={{textAlign:"center", color:"black", fontWeight:"bold"}}>Change Password</h2>
                {submitted ? (
                    <p style={{ textAlign: "center", color: "green" }}>
                        Password successfully changed. Redirecting...
                    </p>
                ) : (
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
                                disabled={loading}
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
                                disabled={loading}
                            />
                            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                        </div>

                        <button
                            type="submit"
                            className={styles.loginButton}
                            disabled={loading || !!errors.password || !!errors.confirmPassword}
                        >
                            {loading ? 'Submitting...' : 'Change Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForcePasswordChangePage;
