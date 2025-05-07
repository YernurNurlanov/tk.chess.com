import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch("http://localhost:8080/auth/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (res.ok) {
                const result = await res.json();
                switch (result.role) {
                    case 'ROLE_ADMIN':
                        navigate('/admin');
                        break;
                    case 'ROLE_TEACHER':
                        navigate('/teacher');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                const responseText = await res.text();
                alert("Login failed:\n" + responseText);
            }
        } catch (error) {
            alert('Error: ' + error.message);
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
