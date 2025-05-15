import React from "react";
import Modal from "../../../Modal.jsx";
import {handleAddStudentToGroup} from "../../../../handlers/teacher/groupHandlers.js";

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
                <label htmlFor="studentId">Student:</label>
                <select id="studentId" name="studentId" required>
                    {addStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                            {student.user.firstName} {student.user.lastName}
                        </option>
                    ))}
                </select>
                <button type="submit" className="btn">Save Student</button>
            </form>
        </Modal>
    );
};

export default AddStudentToGroupModal;
