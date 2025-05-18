import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/StudentSidebar.css";

const StudentSidebar = ({ activeTab, setActiveTab, onLogout, userId }) => {
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [aiLevel, setAiLevel] = useState(3);
    const [playerColor, setPlayerColor] = useState("white");

    const createAIRoom = async () => {
        setIsCreatingRoom(true);
        try {
            const response = await axios.post("http://localhost:8080/api/ai-rooms", {
                userId,
                aiLevel,
                playerColor
            }, {
                withCredentials: true // Include if you need cookies/auth
            });

            
            // Redirect to the new AI room
            window.location.href = `/ai-room/${response.data}`;
        } catch (error) {
            console.error("Error creating AI room:", error);
            alert("Failed to create AI room");
        } finally {
            setIsCreatingRoom(false);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="user-avatar">
                    <img src="avatar.png" alt="User Avatar" />
                </div>
                <h2 className="username">Profile</h2>
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
                    <li className="ai-room-item">
                        <div className="ai-room-controls">
                            <label>
                                <i className="fas fa-robot"></i> Play vs AI
                            </label>
                            <select
                                value={aiLevel}
                                onChange={(e) => setAiLevel(parseInt(e.target.value))}
                                disabled={isCreatingRoom}
                            >
                                {[1, 2, 3, 4, 5, 6].map(level => (
                                    <option key={level} value={level}>Level {level}</option>
                                ))}
                            </select>
                            <select
                                value={playerColor}
                                onChange={(e) => setPlayerColor(e.target.value)}
                                disabled={isCreatingRoom}
                            >
                                <option value="white">White</option>
                                <option value="black">Black</option>
                            </select>
                            <button 
                                onClick={createAIRoom}
                                disabled={isCreatingRoom}
                                className="ai-room-button"
                            >
                                {isCreatingRoom ? "Creating..." : "Start Game"}
                            </button>
                        </div>
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
}

export default StudentSidebar;