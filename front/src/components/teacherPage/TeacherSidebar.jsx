import React from "react";
import { Link } from "react-router-dom";
import {
    faBookOpen, faChessBoard,
    faClipboardCheck,
    faRightFromBracket,
    faUserGraduate,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const TeacherSidebar = ({ currentUser, activeTab, setActiveTab, onLogout }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <FontAwesomeIcon className="icon" style={{fontSize: "30px", marginLeft:"10px"}} icon={faChessBoard}/>
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
                            <FontAwesomeIcon className="icon" icon={faBookOpen}/> Lessons
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className={`nav-item ${activeTab === "students" ? "active" : ""}`}
                            onClick={() => setActiveTab("students")}
                        >
                            <FontAwesomeIcon className="icon" icon={faUserGraduate}/> My Students
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className={`nav-item ${activeTab === "groups" ? "active" : ""}`}
                            onClick={() => setActiveTab("groups")}
                        >
                            <FontAwesomeIcon className="icon" icon={faUsers}/> My Groups
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="#"
                            className={`nav-item ${activeTab === "tasks" ? "active" : ""}`}
                            onClick={() => setActiveTab("tasks")}
                        >
                            <FontAwesomeIcon className="icon" icon={faClipboardCheck}/> Tasks
                        </Link>
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

export default TeacherSidebar;