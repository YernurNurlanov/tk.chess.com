import React, { useState } from 'react';
import Modal from "../../Modal.jsx";
import socket from '../../../socket';
import ACTIONS from "../../../socket/actions.js";
import {Chessboard} from "react-chessboard";

const MaterialsModal = ({ onClose, materials, roomId }) => {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);

    function setPosition(roomID, fen) {
        socket.emit(ACTIONS.CHESS_RESET, { roomID, fen });
    }

    const selectedLevelData = materials?.find((lvl) => lvl.level === selectedLevel);
    const selectedTopicData = selectedLevelData?.topics.find((t) => t.topic === selectedTopic);

    return (
        <Modal onClose={onClose}>
            <div>
                <h2 className="text-xl font-bold mb-4">Select Position</h2>

                <button className="btn" onClick={() => {
                    setPosition(roomId, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
                    onClose();
                }}>
                    Reset table
                </button>

                {!selectedLevel && (
                    <div>
                        <h3>Select level:</h3>
                        <ol className="space-y-2 list-decimal list-inside">
                            {materials?.map((levelGroup) => (
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
                        <button type="button" onClick={() => setSelectedLevel(null)}>
                            ← Levels
                        </button>
                        <div>
                            <h3>Select topic:</h3>
                            <ol className="space-y-2 list-decimal list-inside">
                                {selectedLevelData.topics?.map((topicGroup) => (
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
                    <div className="space-y-4">
                        <button type="button" onClick={() => setSelectedTopic(null)}>
                            ← Topics
                        </button>
                        <ul className="space-y-2">
                            {selectedTopicData.tasks?.map((material) => (
                                <li
                                    key={material.id}
                                    className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setPosition(roomId, material.startFin);
                                        onClose();
                                    }}
                                >
                                    <p><strong>ID:</strong> {material.id}</p>
                                    <Chessboard
                                        position={material.startFin}
                                        arePiecesDraggable={false}
                                        boardOrientation="white"
                                        customBoardStyle={{borderRadius: 6}}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default MaterialsModal;
