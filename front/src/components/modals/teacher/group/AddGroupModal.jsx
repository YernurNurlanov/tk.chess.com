import React from "react";
import Modal from "../../../Modal.jsx";
import {handleAddGroup} from "../../../../handlers/teacher/groupHandlers.js";

const AddGroupModal = ({ onClose, currentUser, setGroups, setAddGroupModalOpen }) => {

    return (
        <Modal onClose={onClose}>
            <h2>Add New Group</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const newGroup = {
                        teacherId: currentUser.id,
                        groupName: formData.get("groupName"),
                        studentIds: [],
                    };
                    handleAddGroup(newGroup, setGroups, setAddGroupModalOpen).then();
                }}
            >
                <div className="form-grid">
                    <label htmlFor="groupName">Group Name:</label>
                    <input type="text" id="groupName" name="groupName" required/>
                </div>
                <button type="submit" className="btn btn-center">Save Group</button>
            </form>
        </Modal>
    );
};

export default AddGroupModal;
