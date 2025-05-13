import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/loginPage.module.css';
import axios from "../axiosInstance.js";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await axios.post(`/auth/`, data);

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
            const validationErrors = error.response.data;
            const message = Object.entries(validationErrors)
                .map(([field, msg]) => `${field}: ${msg}`)
                .join('\n');

            alert('Validation errors:\n' + message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h2 className={styles.loginTitle}>Log in</h2>
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className={styles.formInput}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className={styles.formInput}
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.loginButton}
                    >
                        log in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
