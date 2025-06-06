import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChalkboardTeacher, faChessBoard,
    faClipboardCheck,
    faRightFromBracket,
    faUserGraduate
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = ({ onTabChange, onLogout, activeTab }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <FontAwesomeIcon className="icon" style={{fontSize: "30px", marginLeft:"10px"}} icon={faChessBoard}/>
                <h2 className="username">Admin</h2>
            </div>
            <nav>
                <ul>
                    <li>
                        <a
                            href="#"
                            className={`nav-item ${activeTab === "students" ? "active" : ""}`}
                            onClick={() => onTabChange("students")}
                        >
                            <FontAwesomeIcon className="icon" icon={faUserGraduate}/> Students
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className={`nav-item ${activeTab === "teachers" ? "active" : ""}`}
                            onClick={() => onTabChange("teachers")}
                        >
                            <FontAwesomeIcon className="icon" icon={faChalkboardTeacher}/> Teachers
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className={`nav-item ${activeTab === "tasks" ? "active" : ""}`}
                            onClick={() => onTabChange("tasks")}
                        >
                            <FontAwesomeIcon className="icon" icon={faClipboardCheck}/> Tasks
                        </a>
                    </li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                <a href="#" className="nav-item logout" onClick={onLogout}>
                    <FontAwesomeIcon className="icon" icon={faRightFromBracket}/> Log Out
                </a>
            </div>
        </aside>
    );
};

export default AdminSidebar;