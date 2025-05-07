import React from "react";
import Modal from "../../Modal.jsx";
import {handleDeleteStudentFromGroup} from "../../../handlers/teacher/groupHandlers.js";

const DeleteStudentFromGroupModal = ({ onClose, selectedGroup, selectedStudent, setSelectedGroup,
                                         setDeleteStudentFromGroupModalOpen }) => {

    return (
        <Modal onClose={onClose}>
            <h2>Are you sure you want to delete this student from group?</h2>
            <div className="modal-actions">
                <button className="btn" onClick={() => handleDeleteStudentFromGroup(selectedGroup,
                    selectedStudent, setSelectedGroup, setDeleteStudentFromGroupModalOpen)}>
                    Yes, Delete
                </button>
                <button className="btn" onClick={onClose}>
                    No, Cancel
                </button>
            </div>
        </Modal>
    );
};

export default DeleteStudentFromGroupModal;
