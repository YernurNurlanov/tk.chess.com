import React from "react";
import Modal from "../../../Modal.jsx";
import {handleAddTask} from "../../../../handlers/teacher/lessonHandlers.js";

const AddTaskModal = ({ onClose, selectedLesson, setSelectedLesson, setAddTaskModalOpen }) => {

    return (
        <Modal onClose={onClose}>
            <h2>Add Task</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const request = {
                        lessonId: selectedLesson.id,
                        taskIds: [formData.get("taskId")],
                    };
                    handleAddTask(request, setSelectedLesson, setAddTaskModalOpen).then();
                }}
            >
                <label htmlFor="taskId">Task:</label>
                <input type="text" id="taskId" name="taskId" required />
                <button type="submit" className="btn">Save Task</button>
            </form>
        </Modal>
    );
};

export default AddTaskModal;
