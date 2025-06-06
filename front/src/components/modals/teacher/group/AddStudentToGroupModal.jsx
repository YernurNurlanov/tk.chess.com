import React from "react";
import Modal from "../../../Modal.jsx";
import {handleAddStudentToGroup} from "../../../../handlers/teacher/groupHandlers.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";

const AddStudentToGroupModal = ({onClose, students, selectedGroup, setAddStudentToGroupModalOpen, setSelectedGroup }) => {

    const addStudents = students.filter(
        (student) =>
            !selectedGroup.studentInfos.some(
                (s) => s.studentId === student.id
            )
    );

    return (
        <Modal onClose={onClose}>
            <h2>Add New Student</h2>
            {addStudents.length === 0 ? (
                <div className="empty-state">
                    <FontAwesomeIcon icon={faCircleInfo} className="empty-icon" />
                    <span>No students available.</span>
                </div>
            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const newStudent = {
                            groupId: selectedGroup.id,
                            studentId: formData.get("studentId"),
                        };
                        handleAddStudentToGroup(newStudent, setAddStudentToGroupModalOpen, setSelectedGroup).then();
                    }}
                >
                    <div className="form-grid">
                        <label htmlFor="studentId">Student:</label>
                        <select id="studentId" name="studentId" required>
                            {addStudents.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.user.firstName} {student.user.lastName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-center">Save Student</button>
                </form>
            )}
        </Modal>
    );
};

export default AddStudentToGroupModal;
