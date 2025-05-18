import React, {useEffect, useState} from "react";
import Modal from "../../../Modal.jsx";
import {Chessboard} from "react-chessboard";

const CheckTaskModal = ({ onClose, selectedTask }) => {
    const [fen, setFen] = useState(selectedTask.startFin);
    const [startFen, setStartFen] = useState(selectedTask.startFin);
    const [endFen, setEndFen] = useState(selectedTask.endFin);

    useEffect(() => {
        setFen(selectedTask.startFin);
        setStartFen(selectedTask.startFin);
        setEndFen(selectedTask.endFin);
    }, [selectedTask]);

    const showSolution = () => {
        if (endFen) setFen(endFen);
    };

    const resetToStart = () => {
        setFen(startFen);
    };

    return (
        <Modal onClose={onClose} className="custom-modal">
            <h2>Проверка задачи</h2>
            <Chessboard position={fen} arePiecesDraggable={false} boardWidth={500} />
            {endFen && (
                <div className="button-group" style={{marginTop: '1rem'}}>
                    <button onClick={showSolution}>Показать решение</button>
                    <button onClick={resetToStart}>Вернуть в начало</button>
                </div>
            )}

        </Modal>
    );
};

export default CheckTaskModal;