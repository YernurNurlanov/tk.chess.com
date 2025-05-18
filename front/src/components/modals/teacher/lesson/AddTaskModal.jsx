import React, { useState } from "react";
import Modal from "../../../Modal.jsx";
import { Chessboard } from "react-chessboard";
import { handleAddTask } from "../../../../handlers/teacher/lessonHandlers.js";

const AddTaskModal = ({
                          onClose,
                          selectedLesson,
                          setSelectedLesson,
                          setAddTaskModalOpen,
                          tasks,
                      }) => {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [previewTaskId, setPreviewTaskId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedTaskId) return;

        const request = {
            lessonId: selectedLesson.id,
            taskIds: [selectedTaskId],
        };
        handleAddTask(request, setSelectedLesson, setAddTaskModalOpen).then();
    };

    const selectedLevelData = tasks.find((lvl) => lvl.level === selectedLevel);
    const selectedTopicData = selectedLevelData?.topics.find((t) => t.topic === selectedTopic);

    return (
        <Modal onClose={onClose}>
            <div>
                <h2 className="text-xl font-bold mb-4">Add task</h2>

                {!selectedLevel && (
                    <div>
                        <h3>Select level:</h3>
                        <ol className="space-y-2 list-decimal list-inside">
                            {tasks.map((levelGroup) => (
                                <li key={levelGroup.level}>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => setSelectedLevel(levelGroup.level)}
                                    >
                                        {levelGroup.level}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}


                {selectedLevel && !selectedTopic && (
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => setSelectedLevel(null)}
                        >
                            ← Levels
                        </button>
                        <div>
                            <h3>Select topic:</h3>
                            <ol className="space-y-2 list-decimal list-inside">
                                {selectedLevelData.topics.map((topicGroup, index) => (
                                    <li key={topicGroup.topic}>
                                        <button
                                            type="button"
                                            className="btn w-full text-left"
                                            onClick={() => setSelectedTopic(topicGroup.topic)}
                                        >
                                            {topicGroup.topic}
                                        </button>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                )}

                {selectedLevel && selectedTopic && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={() => setSelectedTopic(null)}
                            >
                                ← Topics
                            </button>

                            {selectedTopicData.tasks.map((task) => {
                                const isPreview = previewTaskId === task.id;
                                const position = isPreview ? task.endFin : task.startFin;

                                return (
                                    <div key={task.id}>
                                        <div>
                                            <span>ID: {task.id}</span>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() =>
                                                    setPreviewTaskId(isPreview ? null : task.id)
                                                }
                                            >
                                                {isPreview ? "Hide answer" : "View answer"}
                                            </button>
                                        </div>

                                        <Chessboard
                                            position={position}
                                            arePiecesDraggable={false}
                                            boardOrientation="white"
                                            customBoardStyle={{borderRadius: 6}}
                                        />

                                        <label>
                                            <input
                                                type="radio"
                                                name="taskId"
                                                value={task.id}
                                                checked={selectedTaskId === task.id}
                                                onChange={() => setSelectedTaskId(task.id)}
                                            />
                                            Select task
                                        </label>
                                    </div>
                                );
                            })}
                            <button
                                type="submit"
                                className="btn"
                            >
                                Save task
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
};

export default AddTaskModal;
