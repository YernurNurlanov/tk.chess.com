import React from "react";
import Modal from "../../../Modal.jsx";
import {handleUpdateGroupName} from "../../../../handlers/teacher/groupHandlers.js";

const UpdateGroupNameModal = ({ onClose, selectedGroup, setSelectedGroup, setUpdateGroupNameModalOpen }) => {

    return (
        <Modal onClose={onClose}>
            <h2>Update Group</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const newGroup = {
                        id: selectedGroup.id,
                        groupName: formData.get("groupName"),
                    };
                    handleUpdateGroupName(newGroup, setSelectedGroup, setUpdateGroupNameModalOpen).then();
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

export default UpdateGroupNameModal;
