import React from "react";
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    const styles = {
        container: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            textAlign: 'center',
            padding: '20px',
        },
        title: {
            fontSize: '48px',
            color: '#d32f2f',
            marginBottom: '16px',
        },
        text: {
            fontSize: '20px',
            marginBottom: '24px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        }
    };
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>404</h1>
            <p style={styles.text}>Page not found</p>
            <button className="btn" onClick={() => navigate('/auth')}>
                Go to authorization
            </button>
        </div>
    );
}
