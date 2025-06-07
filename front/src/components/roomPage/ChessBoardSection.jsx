import React, {useEffect, useRef, useState} from 'react';
import {Chessboard} from 'react-chessboard';
import {Chess} from 'chess.js';
import socket from '../../socket';
import ACTIONS from "../../socket/actions.js";

export default function ChessBoardSection({ roomID }) {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState('start');

    const containerRef = useRef(null);
    const [boardWidth, setBoardWidth] = useState(300); // начальное значение

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setBoardWidth(width);
            }
        };

        updateSize(); // вызов при монтировании
        window.addEventListener("resize", updateSize); // обновление при ресайзе

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        const handleMove = ({ fen }) => {
            const newGame = new Chess(fen);
            setGame(newGame);
            setFen(fen);
        };

        const handleState = ({ fen }) => {
            const loadedGame = new Chess(fen);
            setGame(loadedGame);
            setFen(fen);
        };

        const handleGameOver = ({ message }) => {
            alert(message);
        }

        socket.on('chess-move', handleMove);
        socket.on(ACTIONS.CHESS_STATE, handleState);
        socket.on('chess-game-over', handleGameOver);

        return () => {
            socket.off(ACTIONS.CHESS_MOVE, handleMove);
            socket.off(ACTIONS.CHESS_STATE, handleState);
            socket.off(ACTIONS.CHESS_GAME_OVER, handleGameOver);
        };
    }, []);

    const checkGameOver = (gameInstance) => {
        let message = null;

        if (gameInstance.isGameOver()) {
            if (gameInstance.isCheckmate()) {
                    message = gameInstance.turn() === 'w' ? 'Black wins (checkmate)' : 'White wins (checkmate)';
            } else if (gameInstance.isStalemate()) {
                message = 'Stalemate (draw)';
            } else if (gameInstance.isDraw()) {
                message = 'Draw';
            } else {
                message = 'Game over';
            }
            if (message) {
                alert(message);
                socket.emit(ACTIONS.CHESS_GAME_OVER, { roomID, message });
            }
        }
    };

    const onDrop = (sourceSquare, targetSquare) => {
        const newGame = new Chess(game.fen());
        let move;
        try {
            move = newGame.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });
        } catch (err) {
            console.warn("Невалидный ход:", err.message);
            return false;
        }

        if (!move) return false;

        setGame(newGame);
        setFen(newGame.fen());
        checkGameOver(newGame);

        socket.emit(ACTIONS.CHESS_MOVE, {
            roomID,
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        });

        return true;
    };

    return (
        <div ref={containerRef} style={{ width: "40vw" }}>
            <Chessboard
                id="BasicBoard"
                position={fen}
                onPieceDrop={onDrop}
                boardWidth={boardWidth}
            />
        </div>
    );
}
