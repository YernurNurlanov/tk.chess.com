import React from "react";
import Modal from "../../../Modal.jsx";
import {handleDeleteLesson} from "../../../../handlers/teacher/lessonHandlers.js";

const DeleteLessonModal = ({ onClose, selectedLesson, setLessons, setDeleteLessonModalOpen }) => {

    return (
        <Modal onClose={onClose}>
            <h2>Are you sure you want to delete this lesson?</h2>
            <div className="modal-actions">
                <button className="btn" onClick={() => handleDeleteLesson(selectedLesson, setLessons, setDeleteLessonModalOpen)}>
                    Yes, Delete
                </button>
                <button className="btn" onClick={onClose}>
                    No, Cancel
                </button>
            </div>
        </Modal>
    );
};

export default DeleteLessonModal;
