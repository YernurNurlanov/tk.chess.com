import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import Modal from "../../Modal.jsx";
import { Chess } from "chess.js";
import socket from "../../../socket";
import ACTIONS from "../../../socket/actions.js";

const whitePieces = ["wP", "wN", "wB", "wR", "wQ"];
const blackPieces = ["bP", "bN", "bB", "bR", "bQ"];

export default function NewPositionModal({ onClose, roomId }) {
    const [position, setPosition] = useState({
        e1: "wK",
        e8: "bK",
    });
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [turn, setTurn] = useState("w");

    const onSquareClick = (square) => {
        if (!selectedPiece) return;
        if (position[square]) return;
        setPosition((pos) => ({
            ...pos,
            [square]: selectedPiece,
        }));
        setSelectedPiece(null);
    };

    const onPieceDrop = (sourceSquare, targetSquare, piece) => {
        setPosition((pos) => {
            const newPos = { ...pos };
            newPos[targetSquare] = piece;
            delete newPos[sourceSquare];
            return newPos;
        });
        return true;
    };

    const onSquareRightClick = (square) => {
        if (position[square]?.[1] === "K") return;
        setPosition((pos) => {
            const newPos = { ...pos };
            delete newPos[square];
            return newPos;
        });
    };

    const pieceToUnicode = (piece) => {
        const map = {
            wQ: "♕",
            wR: "♖",
            wB: "♗",
            wN: "♘",
            wP: "♙",
            bQ: "♛",
            bR: "♜",
            bB: "♝",
            bN: "♞",
            bP: "♟︎",
        };
        return map[piece] || "";
    };

    const renderPiecesBar = (pieces) => (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            {pieces.map((p) => (
                <button
                    key={p}
                    style={{
                        width: 45,
                        height: 45,
                        fontSize: 30,
                        margin: "0 4px",
                        backgroundColor: selectedPiece === p ? "#aaf" : "red",
                        cursor: "pointer",
                        userSelect: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: `"Segoe UI Symbol", "DejaVu Sans", "Noto Sans Symbols", "Arial Unicode MS", sans-serif`,
                    }}
                    onClick={() => setSelectedPiece(p)}
                >
                    {pieceToUnicode(p)}
                </button>
            ))}
        </div>
    );

    const sendPosition = () => {
        const chess = new Chess();
        chess.clear();

        Object.entries(position).forEach(([square, piece]) => {
            const color = piece[0];
            const type = piece[1].toLowerCase();
            chess.put({ type, color }, square);
        });

        const fenParts = chess.fen().split(" ");
        fenParts[1] = turn;
        const updatedFEN = fenParts.join(" ");

        socket.emit(ACTIONS.CHESS_RESET, { roomID: roomId, fen: updatedFEN });
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div>
                {renderPiecesBar(blackPieces)}
                <Chessboard
                    position={position}
                    onSquareClick={onSquareClick}
                    onPieceDrop={onPieceDrop}
                    onSquareRightClick={onSquareRightClick}
                />
                {renderPiecesBar(whitePieces)}

                <div style={{textAlign: "center", marginTop: 12}}>
                    <label style={{marginRight: 10}}>
                        <input
                            type="radio"
                            name="turn"
                            value="w"
                            checked={turn === "w"}
                            onChange={() => setTurn("w")}
                        />
                        White to move
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="turn"
                            value="b"
                            checked={turn === "b"}
                            onChange={() => setTurn("b")}
                        />
                        Black to move
                    </label>
                </div>

                <div style={{textAlign: "center", marginTop: 12}}>
                    <button onClick={sendPosition} className="btn">
                        Save position
                    </button>
                </div>
            </div>
        </Modal>
    );
}
