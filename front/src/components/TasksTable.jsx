import React, { useState } from "react";

const TasksTable = ({ data, onDelete }) => {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    if (!data || data.length === 0) return <p>No data available</p>;

    const resetToLevels = () => {
        setSelectedLevel(null);
        setSelectedTopic(null);
    };

    const resetToTopics = () => {
        setSelectedTopic(null);
    };

    return (
        <div className="table">
            <div className="table-row header">
                <div className="table-cell">{selectedLevel ? (selectedTopic ? "Start" : "Topic") : "Level"}</div>
                <div className="table-cell">{selectedLevel ? (selectedTopic ? "End" : "Actions") : "Actions"}</div>
                <div className="table-cell">{selectedLevel ? (selectedTopic ? "Actions" : "") : ""}</div>
            </div>

            {!selectedLevel &&
                data.map((levelData) => (
                    <div
                        key={levelData.level}
                        className="table-row clickable"
                        onClick={() => setSelectedLevel(levelData)}
                    >
                        <div className="table-cell">{levelData.level}</div>
                        <div className="table-cell">▶ View Topics</div>
                    </div>
                ))}

            {selectedLevel && !selectedTopic &&
                selectedLevel.topics.map((topicData) => (
                    <div
                        key={topicData.topic}
                        className="table-row clickable"
                        onClick={() => setSelectedTopic(topicData)}
                    >
                        <div className="table-cell">{topicData.topic}</div>
                        <div className="table-cell">▶ View Tasks</div>
                    </div>
                ))}

            {selectedTopic &&
                selectedTopic.tasks.map((task) => (
                    <div key={task.id} className="table-row">
                        <div className="table-cell">{task.startFin}</div>
                        <div className="table-cell">{task.endFin}</div>
                        <button className="btn btn-delete" onClick={() => onDelete(task)}>
                            <i className="fas fa-trash"></i>Delete
                        </button>
                    </div>
                ))}

            {(selectedLevel || selectedTopic) && (
                <div className="table-row actions-row">
                {selectedTopic ? (
                        <button onClick={resetToTopics} className="btn btn-back">
                            ◀ Back to Topics
                        </button>
                    ) : (
                        <button onClick={resetToLevels} className="btn btn-back">
                            ◀ Back to Levels
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TasksTable;
