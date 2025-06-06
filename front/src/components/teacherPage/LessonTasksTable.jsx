import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faPlus} from "@fortawesome/free-solid-svg-icons";

const LessonTasksTable = ({ tasks, onCheck, onAddTask }) => (
    <div className="card">
        <div className="header">
            <h2>Tasks</h2>
            <button className="btn" onClick={onAddTask}>
                <FontAwesomeIcon icon={faPlus}/> Add Task
            </button>
        </div>
        <div className="table">
            <div className="table-row header">
                <div className="table-cell header">ID</div>
                <div className="table-cell header">Level</div>
                <div className="table-cell header">Topic</div>
                <div className="table-cell header">Actions</div>
            </div>
            {tasks?.map((task) => (
                <div key={task.id} className="table-row">
                    <div className="table-cell">{task.id}</div>
                    <div className="table-cell">{task.level.charAt(0).toUpperCase() + task.level.slice(1).toLowerCase()}</div>
                    <div className="table-cell">{task.topic}</div>
                    <div className="table-cell actions">
                        <button className="btn" onClick={() => onCheck(task)}>
                            <FontAwesomeIcon icon={faEye} /> Check
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default LessonTasksTable;
