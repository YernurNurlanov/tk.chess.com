import React from "react";
import Modal from "../../Modal.jsx";
import {handleAddStudentToGroup} from "../../../handlers/teacher/groupHandlers.js";

const AddStudentToGroupModal = ({onClose, selectedGroup, setAddStudentToGroupModalOpen, setSelectedGroup }) => {

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
                <label htmlFor="studentId">Id:</label>
                <input type="number" id="studentId" name="studentId" required />
                <button type="submit" className="btn">Save Student</button>
            </form>
        </Modal>
    );
};

export default AddStudentToGroupModal;
