import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";

const GroupDetails = ({ selectedGroup, setSelectedStudent, setDeleteStudentFromGroupModalOpen, onAddStudent }) => {

    return (
        <>
            <div className="header">
                <h2>
                    All Students
                </h2>
                <button className="btn" onClick={onAddStudent}>
                    <FontAwesomeIcon icon={faPlus}/> Add Student
                </button>
            </div>
            <div className="table">
                <div className="table-row header">
                    <div className="table-cell">ID</div>
                    <div className="table-cell">Name</div>
                    <div className="table-cell">Performance</div>
                    <div className="table-cell">Actions</div>
                </div>
                {selectedGroup.studentInfos?.map((student) => (
                    <div key={student.studentId} className="table-row">
                        <div className="table-cell">{student.studentId}</div>
                        <div className="table-cell">{student.lastName} {student.firstName}</div>
                        <div className="table-cell">
                            {
                                (() => {
                                    const tasks = student.performance || [];
                                    const completedCount = tasks.filter(t => t.completed).length;
                                    const notCompletedCount = tasks.filter(t => !t.completed).length;
                                    const total = tasks.length;

                                    return `${total} (✅${completedCount},❌${notCompletedCount})`;
                                })()
                            }
                        </div>
                        <div className="table-cell actions">
                            <button
                                className="btn btn-delete"
                                onClick={() => {
                                    setSelectedStudent(student);
                                    setDeleteStudentFromGroupModalOpen(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash}/> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>

    );
};

export default GroupDetails;
