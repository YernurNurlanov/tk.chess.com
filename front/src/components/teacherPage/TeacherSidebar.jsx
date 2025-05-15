import React from "react";
import { Link } from "react-router-dom";

const TeacherSidebar = ({ activeTab, setActiveTab, onLogout }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="user-avatar">
                    <img src="../../../public/avatar.jpeg" alt="User Avatar" />
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
                            className={`nav-item ${activeTab === "students" ? "active" : ""}`}
                            onClick={() => setActiveTab("students")}
                        >
                            <i className="fas fa-users"></i>My Students
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className={`nav-item ${activeTab === "groups" ? "active" : ""}`}
                            onClick={() => setActiveTab("groups")}
                        >
                            <i className="fas fa-layer-group"></i>My Groups
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
                        <a href="#" className="nav-item" onClick={onLogout}>
                            <i className="fas fa-sign-out-alt"></i>Log Out
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default TeacherSidebar;