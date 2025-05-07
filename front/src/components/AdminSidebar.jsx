import React from "react";
import "../styles.css"

const AdminSidebar = ({ onTabChange, onLogout }) => {
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
                        <a
                            href="#"
                            className="nav-item"
                            onClick={() => onTabChange("students")} // Pass "students" to onTabChange
                        >
                            <i className="fas fa-users"></i>Students
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="nav-item"
                            onClick={() => onTabChange("teachers")} // Pass "teachers" to onTabChange
                        >
                            <i className="fas fa-chalkboard-teacher"></i>Teachers
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="nav-item"
                            onClick={() => onTabChange("tasks")}
                        >
                            <i className="fas fa-chalkboard-teacher"></i>Tasks
                        </a>
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

export default AdminSidebar;