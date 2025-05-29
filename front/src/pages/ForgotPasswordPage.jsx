import React, { useState } from 'react';
import styles from '../styles/loginPage.module.css';
import axios from "../axiosInstance.js";
import { handleError } from "../handlers/handleError.js";

const ForgotPasswordPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            setLoading(true);
            await axios.post('/auth/password-reset/request', data);
            setSubmitted(true);
        } catch (error) {
            handleError(error, "Validation errors");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 style={{textAlign:"center", color: "black", fontWeight:"bold"}}>Account Recovery</h2>
                {submitted ? (
                    <p style={{ textAlign: "center", color: "green" }}>
                        If an account with this email exists, a reset link has been sent.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className={styles.formInput}
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.loginButton}
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send the link'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
