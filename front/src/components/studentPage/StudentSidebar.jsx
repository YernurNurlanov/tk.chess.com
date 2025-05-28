import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/StudentSidebar.css";

const StudentSidebar = ({ currentUser, activeTab, setActiveTab, onLogout, userId }) => {
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);

    const url = import.meta.env.VITE_API_URL;

    const createAIRoom = async () => {
        setIsCreatingRoom(true);
        try {
            console.log("Attempting to create AI room with userId:", userId);
            const response = await axios.post(
                `${url}/games/`,
                {
                    userId,
                    aiLevel: 3,
                    playerColor: "white"
                }, 
                {
                    withCredentials: true
                }
            );

            // Redirect to the new AI room
            window.location.href = `/ai-room/${response.data}`;
        } catch (error) {
            console.error("Error creating AI room:", error);
            alert("Failed to create AI room: " + (error.response?.data?.message || error.message));
        } finally {
            setIsCreatingRoom(false);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="user-avatar">
                    <img src="../../../public/avatar.jpeg" alt="User Avatar" />
                </div>
                {currentUser && <h2 className="username">{currentUser.firstName} {currentUser.lastName}</h2>}
            </div>
            <nav>
                <ul>
                    <li>
                        <Link
                            to="#"
                            className={`nav-item ${activeTab === "lessons" ? "active" : ""}`}
                            onClick={() => setActiveTab("lessons")}
                        >
                            <i className="fas fa-book"></i>Lessons
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className={`nav-item ${activeTab === "tasks" ? "active" : ""}`}
                            onClick={() => setActiveTab("tasks")}
                        >
                            <i className="fas fa-layer-group"></i>Tasks
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className={`nav-item ${activeTab === "ai-game" ? "active" : ""}`}
                            onClick={createAIRoom}
                            disabled={isCreatingRoom}
                        >
                            <i className="fas fa-robot"></i>
                            {isCreatingRoom ? "Creating Game..." : "Play vs AI"}
                        </Link>
                    </li>
                    <li>
                        <a href="#" className="nav-item" onClick={onLogout}>
                            <i className="fas fa-sign-out-alt"></i>Log Out
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default StudentSidebar;