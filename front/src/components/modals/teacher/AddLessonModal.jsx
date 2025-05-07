import React from "react";
import Modal from "../../Modal.jsx";
import {handleAddLesson} from "../../../handlers/teacher/lessonHandlers.js";

const AddLessonModal = ({ onClose, currentUser, groups, setLessons, setAddLessonModalOpen }) => {

    return (
        <Modal onClose={onClose}>
            <h2>Add New Lesson</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const newLesson = {
                        teacherId: currentUser.id,
                        groupId: formData.get("groupId"),
                        startTime: formData.get("startTime"),
                        endTime: formData.get("endTime"),
                        taskIds: [],
                        presentStudentIds: [],
                    };
                    handleAddLesson(newLesson, setLessons, setAddLessonModalOpen).then();
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
                <input type="datetime-local" id="startTime" name="startTime" required />

                <label htmlFor="endTime">End Time:</label>
                <input type="datetime-local" id="endTime" name="endTime" required />

                <button type="submit" className="btn">Save Lesson</button>
            </form>
        </Modal>
    );
};

export default AddLessonModal;
