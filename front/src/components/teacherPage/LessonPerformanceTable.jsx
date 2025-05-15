import React from 'react';

const LessonPerformanceTable = ({ studentInfoDTOs }) => {

    return (
        <div className="table">
            <div className="table-row header">
                <div className="table-cell">Student</div>
                <div className="table-cell">Task ID</div>
                <div className="table-cell">Attempt</div>
                <div className="table-cell">Completed</div>
                <div className="table-cell">Completed At</div>
            </div>
            {studentInfoDTOs?.flatMap((student) =>
                student.performance.map((p) => (
                    <div key={`${student.studentId}-${p.taskId}-${p.attemptNumber}`} className="table-row">
                        <div className="table-cell">{student.lastName} {student.firstName}</div>
                        <div className="table-cell">{p.taskId}</div>
                        <div className="table-cell">{p.attemptNumber}</div>
                        <div className="table-cell">{p.completed ? "Yes" : "No"}</div>
                        <div className="table-cell">
                            {p.completedAt ? new Date(p.completedAt).toLocaleString() : "—"}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default LessonPerformanceTable;
