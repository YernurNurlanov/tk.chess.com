import React, { useState } from "react";

const TasksTable = ({ data, onDelete, onCheck }) => {
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

    const renderHeaderPath = () => {
        const path = ["Уровни"];
        if (selectedLevel) path.push(selectedLevel.level);
        if (selectedTopic) path.push(selectedTopic.topic);
        return path.join(" / ");
    };

    return (
        <div className="table">
            <div className="table-header">
                {(selectedLevel || selectedTopic) && (
                    <button
                        className="btn btn-back"
                        onClick={selectedTopic ? resetToTopics : resetToLevels}
                        style={{ marginRight: '1rem' }}
                    >
                        ◀ Назад
                    </button>
                )}
                <span className="table-path">{renderHeaderPath()}</span>
            </div>

            <div className="table-row header">
                {!selectedLevel && (
                    <>
                        <div className="table-cell">Level</div>
                        <div className="table-cell">Actions</div>
                    </>
                )}

                {selectedLevel && !selectedTopic && (
                    <>
                        <div className="table-cell">Topic</div>
                        <div className="table-cell">Actions</div>
                    </>
                )}

                {selectedTopic && (
                    <>
                        <div className="table-cell">ID</div>
                        <div className="table-cell">Level</div>
                        <div className="table-cell">Topic</div>
                        <div className="table-cell">Actions</div>
                    </>
                )}
            </div>

            {/* Уровни */}
            {!selectedLevel &&
                data.map((levelData) => (
                    <div
                        key={levelData.level}
                        className="table-row clickable"
                        onClick={() => setSelectedLevel(levelData)}
                    >
                        <div className="table-cell">{levelData.level}</div>
                        <div className="table-cell">▶ Смотреть темы</div>
                    </div>
                ))}

            {/* Темы */}
            {selectedLevel && !selectedTopic &&
                selectedLevel.topics.map((topicData) => (
                    <div
                        key={topicData.topic}
                        className="table-row clickable"
                        onClick={() => setSelectedTopic(topicData)}
                    >
                        <div className="table-cell">{topicData.topic}</div>
                        <div className="table-cell">▶ Смотреть задания</div>
                    </div>
                ))}

            {/* Задания */}
            {selectedTopic &&
                selectedTopic.tasks.map((task) => (
                    <div key={task.id} className="table-row">
                        <div className="table-cell">{task.id}</div>
                        <div className="table-cell">{selectedLevel.level}</div>
                        <div className="table-cell">{selectedTopic.topic}</div>
                        <div className="table-cell">
                            <button className="btn btn-check" onClick={() => onCheck(task)}>
                                👁
                            </button>
                            {onDelete && (
                                <button className="btn btn-delete" onClick={() => onDelete(task)}>
                                    🗑 Удалить
                                </button>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default TasksTable;
