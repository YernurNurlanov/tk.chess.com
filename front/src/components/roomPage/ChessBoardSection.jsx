import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import socket from '../../socket';
import ACTIONS from "../../socket/actions.js";

export default function ChessBoardSection({ roomID }) {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState('start');
    const [gameOverMessage, setGameOverMessage] = useState(null);

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

        socket.on('chess-move', handleMove);
        socket.on(ACTIONS.CHESS_STATE, handleState);

        return () => {
            socket.off(ACTIONS.CHESS_MOVE, handleMove);
            socket.off(ACTIONS.CHESS_STATE, handleState);
        };
    }, []);

    const checkGameOver = (gameInstance) => {
        if (gameInstance.isGameOver()) {
            if (gameInstance.isCheckmate()) {
                const winner = gameInstance.turn() === 'w' ? 'Чёрные' : 'Белые';
                setGameOverMessage(`${winner} победили (мат)`);
            } else if (gameInstance.isStalemate()) {
                setGameOverMessage('Пат (ничья)');
            } else if (gameInstance.isDraw()) {
                setGameOverMessage('Ничья');
            } else {
                setGameOverMessage('Игра окончена');
            }
        } else {
            setGameOverMessage(null);
        }
    };

    const handleReset = () => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setGameOverMessage(null); // убрать надпись о завершении

        socket.emit(ACTIONS.CHESS_RESET, {
            roomID,
            fen: newGame.fen(),
        });
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
        <div style={{
            position: 'absolute',
            left: "4rem",
            top: 0,
            width: '50vw',
            height: '100vh',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Chessboard
                id="BasicBoard"
                position={fen}
                onPieceDrop={onDrop}
                boardWidth={700}
            />
            {gameOverMessage && (
                <div style={{
                    marginTop: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'red',
                }}>
                    {gameOverMessage}
                </div>
            )}

            <button
                onClick={handleReset}
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Начать заново
            </button>
        </div>
    );
}
