import React from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TasksTable = ({
                        data,
                        selectedLevelName,
                        selectedTopicName,
                        setSelectedLevelName,
                        setSelectedTopicName,
                        onDelete,
                        onCheck
                    }) => {

    if (!data || data.length === 0) return <p>No data available</p>;

    const selectedLevel = data.find(level => level.level === selectedLevelName);
    const selectedTopic = selectedLevel?.topics.find(topic => topic.topic === selectedTopicName);

    const resetToLevels = () => {
        setSelectedLevelName(null);
        setSelectedTopicName(null);
    };

    const resetToTopics = () => {
        setSelectedTopicName(null);
    };

    const renderHeaderPath = () => {
        const path = ["Levels"];
        if (selectedLevelName) path.push(selectedLevelName);
        if (selectedTopicName) path.push(selectedTopicName);
        return path.join(" / ");
    };

    return (
        <>
            <div className="table-header">
                {(selectedLevelName || selectedTopicName) && (
                    <button
                        className="btn-back"
                        onClick={selectedTopicName ? resetToTopics : resetToLevels}
                        style={{ marginRight: '1rem' }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                )}
                <span className="table-path">{renderHeaderPath()}</span>
            </div>
            <div className="table">
                <div className="table-row header">
                    {!selectedLevelName && (
                        <>
                            <div className="table-cell">Level</div>
                            <div className="table-cell">Actions</div>
                        </>
                    )}

                    {selectedLevelName && !selectedTopicName && (
                        <>
                            <div className="table-cell">Topic</div>
                            <div className="table-cell">Actions</div>
                        </>
                    )}

                    {selectedTopicName && (
                        <>
                            <div className="table-cell">ID</div>
                            <div className="table-cell">Level</div>
                            <div className="table-cell">Topic</div>
                            <div className="table-cell">Actions</div>
                        </>
                    )}
                </div>

                {!selectedLevelName &&
                    data.map((levelData) => (
                        <div
                            key={levelData.level}
                            className="table-row clickable"
                            onClick={() => setSelectedLevelName(levelData.level)}
                        >
                            <div className="table-cell">{levelData.level}</div>
                            <div className="table-cell">▶ Look topics</div>
                        </div>
                    ))}

                {selectedLevel && !selectedTopic &&
                    selectedLevel.topics.map((topicData) => (
                        <div
                            key={topicData.topic}
                            className="table-row clickable"
                            onClick={() => setSelectedTopicName(topicData.topic)}
                        >
                            <div className="table-cell">{topicData.topic}</div>
                            <div className="table-cell">▶ Look tasks</div>
                        </div>
                    ))}

                {selectedTopic &&
                    selectedTopic.tasks.map((task) => (
                        <div key={task.id} className="table-row">
                            <div className="table-cell">{task.id}</div>
                            <div className="table-cell">{selectedLevel.level}</div>
                            <div className="table-cell">{selectedTopic.topic}</div>
                            <div className="table-cell actions">
                                <button className="btn btn-check" onClick={() => onCheck(task)}>
                                    👁
                                </button>
                                {onDelete && (
                                    <button className="btn btn-delete" onClick={() => onDelete(task)}>
                                        🗑 Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default TasksTable;
