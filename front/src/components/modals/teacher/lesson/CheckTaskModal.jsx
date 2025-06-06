import React, {useEffect, useState} from "react";
import Modal from "../../../Modal.jsx";
import {Chessboard} from "react-chessboard";

const CheckTaskModal = ({ onClose, selectedTask }) => {
    const [fen, setFen] = useState(selectedTask.startFin);
    const [startFen, setStartFen] = useState(selectedTask.startFin);
    const [endFen, setEndFen] = useState(selectedTask.endFin);
    const [showingSolution, setShowingSolution] = useState(false);

    useEffect(() => {
        setFen(selectedTask.startFin);
        setStartFen(selectedTask.startFin);
        setEndFen(selectedTask.endFin);
        setShowingSolution(false);
    }, [selectedTask]);

    const toggleSolution = () => {
        if (!endFen) return;

        if (showingSolution) {
            setFen(startFen);
        } else {
            setFen(endFen);
        }
        setShowingSolution(!showingSolution);
    };

    return (
        <Modal onClose={onClose} className="custom-modal">
            <h2>Viewing a Task</h2>
            <Chessboard position={fen} arePiecesDraggable={false} customBoardStyle={{borderRadius: 6}} />
            {endFen && (
                <button onClick={toggleSolution} className="btn btn-center">
                    {showingSolution ? "Hide answer" : "View answer"}
                </button>
            )}

        </Modal>
    );
};

export default CheckTaskModal;