import React from 'react';

const LessonAttendanceTable = ({ studentInfoDTOs, setSelectedLesson, selectedLesson, handleSubmitAttendance }) => {

    const handleCheckboxChange = (studentId, checked) => {
        const updated = studentInfoDTOs.map(s =>
            s.studentId === studentId ? { ...s, attended: checked } : s
        );
        setSelectedLesson({ ...selectedLesson, studentInfoDTOs: updated });
    };

    const handleSubmit = () => {
        const attendedStudentIds = studentInfoDTOs
            .filter(student => student.attended)
            .map(student => student.studentId);

        const request = {
            lessonId: selectedLesson.id,
            studentIds: attendedStudentIds,
        };

        handleSubmitAttendance(request);
    };

    return (
        <div className="card">
            <div className="header">
                <h2>Attendance</h2>
                <button className="btn" onClick={handleSubmit}>Submit Attendance</button>
            </div>
            <div className="table">
                <div className="table-row header">
                <div className="table-cell">Student</div>
                    <div className="table-cell">Attended</div>
                </div>
                {studentInfoDTOs?.map((student) => (
                    <div key={student.studentId} className="table-row">
                        <div className="table-cell">{student.lastName} {student.firstName}</div>
                        <div className="table-cell">
                            <input
                                type="checkbox"
                                checked={student.attended}
                                onChange={(e) => handleCheckboxChange(student.studentId, e.target.checked)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonAttendanceTable;
