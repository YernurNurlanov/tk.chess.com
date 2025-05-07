import React from "react";
import Modal from "../../Modal.jsx";
import {handleDeleteGroup} from "../../../handlers/teacher/groupHandlers.js";

const DeleteGroupModal = ({ onClose, selectedGroup, setGroups, setDeleteGroupModalOpen }) => {

    return (
        <Modal onClose={onClose}>
            <h2>Are you sure you want to delete this group?</h2>
            <div className="modal-actions">
                <button className="btn" onClick={() => handleDeleteGroup(selectedGroup, setGroups, setDeleteGroupModalOpen)}>
                    Yes, Delete
                </button>
                <button className="btn" onClick={onClose}>
                    No, Cancel
                </button>
            </div>
        </Modal>
    );
};

export default DeleteGroupModal;
