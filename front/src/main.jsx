import React from "react";
import ReactDOM from 'react-dom/client'
import './index.css'
import AppRouter from "./routes/AppRouter.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";

window.alert = function (message, type = "info") {
    const colors = {
        info: "#3498db",
        error: "#ff7c78"
    };

    const icons = {
        info: "ℹ️",
        error: "❌"
    };

    const alertBox = document.createElement("div");
    alertBox.innerText = `${icons[type] || "ℹ️"} ${message}`;

    alertBox.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${colors[type] || "#3498db"};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 15px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.4s ease, transform 0.4s ease;
        z-index: 9999;
        pointer-events: none;
    `;

    document.body.appendChild(alertBox);

    requestAnimationFrame(() => {
        alertBox.style.opacity = "1";
        alertBox.style.transform = "translateX(-50%) translateY(0)";
    });

    setTimeout(() => {
        alertBox.style.opacity = "0";
        alertBox.style.transform = "translateX(-50%) translateY(-10px)";
        setTimeout(() => alertBox.remove(), 400);
    }, 5000);
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="756752521081-p0du6951j4598agcdbaoumt3dsv6ikup.apps.googleusercontent.com">
        <React.StrictMode>
            <AppRouter />
        </React.StrictMode>
    </GoogleOAuthProvider>
);
