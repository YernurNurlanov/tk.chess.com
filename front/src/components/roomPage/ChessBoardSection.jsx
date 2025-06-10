import React, {useEffect, useRef, useState} from 'react';
import {Chessboard} from 'react-chessboard';
import {Chess} from 'chess.js';
import socket from '../../socket';
import ACTIONS from "../../socket/actions.js";
import MoveHistory from './MoveHistory';
import styles from '../../styles/roomPage.module.css';
import VideoSection from "./VideoSection.jsx";

export default function ChessBoardSection({ roomID,
                                              mainClientID,
                                              secondaryClients,
                                              provideMediaRef,
                                              toggleAudio,
                                              toggleVideo,
                                              isMicOn,
                                              isCameraOn
}) {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState('start');
    const [moveHistory, setMoveHistory] = useState([]);
    const [fenHistory, setFenHistory] = useState(['start']);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

    const containerRef = useRef(null);
    const [boardWidth, setBoardWidth] = useState(300);

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setBoardWidth(width);
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    useEffect(() => {
        const handleMove = ({ fen, history, fenHistory, currentMoveIndex }) => {
            const newGame = new Chess(fen);
            setGame(newGame);
            setFen(fen);
            setMoveHistory(history);
            setFenHistory(fenHistory);
            setCurrentMoveIndex(currentMoveIndex);
        };

        const handleState = ({ fen, history, fenHistory, currentMoveIndex }) => {
            const newGame = new Chess(fen);
            setGame(newGame);
            setFen(fen);
            setMoveHistory(history || []);
            setFenHistory(fenHistory || [fen]);
            setCurrentMoveIndex(currentMoveIndex ?? (history?.length - 1 ?? -1));
        };

        const handleGoToMove = ({ fen, currentMoveIndex, history, fenHistory }) => {
            const newGame = new Chess(fen);
            setGame(newGame);
            setFen(fen);
            setCurrentMoveIndex(currentMoveIndex);
            if (history) setMoveHistory(history);
            if (fenHistory) setFenHistory(fenHistory);
        };

        const handleGameOver = ({ message }) => {
            alert(message);
        }

        socket.on('chess-move', handleMove);
        socket.on(ACTIONS.CHESS_STATE, handleState);
        socket.on(ACTIONS.CHESS_GO_TO_MOVE, handleGoToMove);
        socket.on(ACTIONS.CHESS_GAME_OVER, handleGameOver);

        socket.emit(ACTIONS.CHESS_STATE, { roomID });
        return () => {
            socket.off(ACTIONS.CHESS_MOVE, handleMove);
            socket.off(ACTIONS.CHESS_STATE, handleState);
            socket.off(ACTIONS.CHESS_GO_TO_MOVE, handleGoToMove);
            socket.off(ACTIONS.CHESS_GAME_OVER, handleGameOver);
        };
    }, []);

    const handleMoveClick = (index) =>  {
        const targetFen = fenHistory[index + 1];
        const newGame = new Chess(targetFen);
        setGame(newGame);
        setFen(targetFen);
        setCurrentMoveIndex(index);

        socket.emit(ACTIONS.CHESS_GO_TO_MOVE, {
            roomID,
            moveIndex: index
        });
    };

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

    const onDrop = (sourceSquare, targetSquare, promotion) => {
        const newGame = new Chess(game.fen());
        let move;
        try {
            const piece = newGame.get(sourceSquare);
            const moveObj = {
                from: sourceSquare,
                to: targetSquare
            };
            if (piece && piece.type === 'p' &&
                ((piece.color === 'w' && targetSquare[1] === '8') ||
                    (piece.color === 'b' && targetSquare[1] === '1'))) {
                moveObj.promotion = promotion.slice(-1).toLowerCase();
            }

            move = newGame.move(moveObj);
        } catch (err) {
            console.warn(err.message);
            return false;
        }

        if (!move) return false;

        checkGameOver(newGame);

        socket.emit(ACTIONS.CHESS_MOVE, {
            roomID,
            from: sourceSquare,
            to: targetSquare,
            promotion: move.promotion
        });

        return true;
    };

    return (
        <div className={styles["main-content"]}>
            <div className={styles["chessboard-section"]}>
                <div ref={containerRef} style={{width: "40vw"}}>
                    <Chessboard
                        id="BasicBoard"
                        position={fen}
                        onPieceDrop={onDrop}
                        boardWidth={boardWidth}
                    />
                </div>
            </div>
            <div>
                <VideoSection
                    mainClientID={mainClientID}
                    secondaryClients={secondaryClients}
                    provideMediaRef={provideMediaRef}
                    toggleAudio={toggleAudio}
                    toggleVideo={toggleVideo}
                    isMicOn={isMicOn}
                    isCameraOn={isCameraOn}
                />
                <div className={styles["move-history"]}>
                    <MoveHistory
                        history={moveHistory}
                        currentMoveIndex={currentMoveIndex}
                        onMoveClick={handleMoveClick}
                    />
                </div>
            </div>
        </div>
    );
}