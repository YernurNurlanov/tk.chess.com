import React from "react";
import Modal from "../../Modal.jsx";
import {handleUpdateLesson} from "../../../handlers/teacher/lessonHandlers.js";

const UpdateLessonModal = ({ onClose, selectedLesson, groups, setSelectedLesson, setUpdateLessonModalOpen }) => {

    return (
        <Modal onClose={onClose}>
            <h2>Update Lesson</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const request = {
                        lessonId: selectedLesson.id,
                        groupId: formData.get("groupId"),
                        startTime: formData.get("startTime"),
                        endTime: formData.get("endTime"),
                    };
                    handleUpdateLesson(request, setSelectedLesson, setUpdateLessonModalOpen).then();
                }}
            >
                <label htmlFor="groupId">Group:</label>
                <select id="groupId" name="groupId" required>
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.groupName}
                        </option>
                    ))}
                </select>

                <label htmlFor="startTime">Start Time:</label>
                <input
                    type="datetime-local"
                    defaultValue={selectedLesson.startTime}
                    id="startTime"
                    name="startTime"
                    required
                />

                <label htmlFor="endTime">End Time:</label>
                <input
                    type="datetime-local"
                    defaultValue={selectedLesson.endTime}
                    id="endTime"
                    name="endTime"
                    required
                />

                <button type="submit" className="btn">Update Lesson</button>
            </form>
        </Modal>
    );
};

export default UpdateLessonModal;
