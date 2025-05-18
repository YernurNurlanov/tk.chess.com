import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from 'axios';
import '../styles/AIChessRoom.css';

export default function AIChessRoom() {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState('start');
    const [gameOverMessage, setGameOverMessage] = useState(null);
    const [feedbackMode, setFeedbackMode] = useState('instant');
    const [aiLevel, setAiLevel] = useState(3);
    const [feedback, setFeedback] = useState(null);
    const [gameAnalysis, setGameAnalysis] = useState(null);
    const [playerColor, setPlayerColor] = useState('white');
    const [isThinking, setIsThinking] = useState(false);

    // Initialize game based on player color
    useEffect(() => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setGameOverMessage(null);
        setFeedback(null);
        setGameAnalysis(null);
    }, [playerColor]);

    // Check if it's AI's turn after player move
    useEffect(() => {
        if (!gameOverMessage && game.turn() !== playerColor[0] && !isThinking) {
            setIsThinking(true);
            setTimeout(makeAIMove, 500);
        }
    }, [fen, gameOverMessage]);

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
            return true;
        }
        return false;
    };

    const makeAIMove = async () => {
        if (game.isGameOver()) return;

        try {
            const response = await axios.post('http://localhost:5001/get-ai-move', {
                fen: game.fen(),
                skillLevel: aiLevel
            });

            const newGame = new Chess(game.fen());
            newGame.move(response.data.move);

            setGame(newGame);
            setFen(newGame.fen());
            checkGameOver(newGame);
        } catch (error) {
            console.error('AI move error:', error);
        } finally {
            setIsThinking(false);
        }
    };

    const analyzeMove = async (move) => {
        try {
            const response = await axios.post("http://localhost:5001/analyze-move", { fen, move });
            setFeedback(response.data);
        } catch (error) {
            console.error('Move analysis error:', error);
        }
    };

    const analyzeGame = async () => {
        const moves = game.history();
        try {
            const response = await axios.post('http://localhost:5001/analyze-game', { moves });
            setGameAnalysis(response.data);
        } catch (error) {
            console.error('Game analysis error:', error);
        }
    };

    const handleReset = () => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setGameOverMessage(null);
        setFeedback(null);
        setGameAnalysis(null);
        setIsThinking(false);
    };

    const onDrop = async (sourceSquare, targetSquare) => {
        // Prevent move if it's not player's turn or game is over
        if (game.turn() !== playerColor[0] || gameOverMessage) {
            return false;
        }

        const move = {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        };

        try {
            const newGame = new Chess(game.fen());
            const result = newGame.move(move);
            if (!result) return false;

            setGame(newGame);
            setFen(newGame.fen());

            if (feedbackMode === 'instant') {
                await analyzeMove(`${sourceSquare}${targetSquare}`);
            }

            checkGameOver(newGame);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div className="ai-chess-room">
            <div className="chess-container">
                <div className="chess-controls">
                    <div className="control-group">
                        <label>
                            Цвет:
                            <select 
                                value={playerColor}
                                onChange={(e) => setPlayerColor(e.target.value)}
                                disabled={game.history().length > 0}
                            >
                                <option value="white">Белые</option>
                                <option value="black">Чёрные</option>
                            </select>
                        </label>
                    </div>
                    
                    <div className="control-group">
                        <label>
                            Уровень ИИ:
                            <select 
                                value={aiLevel}
                                onChange={(e) => setAiLevel(parseInt(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5, 6].map(level => (
                                    <option key={level} value={level}>Уровень {level}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    
                    <div className="control-group">
                        <label>
                            Анализ:
                            <select 
                                value={feedbackMode}
                                onChange={(e) => setFeedbackMode(e.target.value)}
                            >
                                <option value="instant">Мгновенный</option>
                                <option value="end">После игры</option>
                            </select>
                        </label>
                    </div>
                    
                    <button onClick={handleReset} className="control-button">
                        Новая игра
                    </button>
                    
                    {feedbackMode === 'end' && game.isGameOver() && (
                        <button onClick={analyzeGame} className="control-button">
                            Анализ игры
                        </button>
                    )}
                </div>
                
                <div className="chessboard-wrapper">
                    <Chessboard
                        position={fen}
                        onPieceDrop={onDrop}
                        boardWidth={600}
                        boardOrientation={playerColor}
                        customBoardStyle={{
                            borderRadius: '4px',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                        }}
                    />
                    {isThinking && <div className="thinking-overlay">ИИ думает...</div>}
                </div>
                
                {gameOverMessage && (
                    <div className="game-over-message">
                        {gameOverMessage}
                    </div>
                )}
                
                {feedback && feedbackMode === 'instant' && (
                    <div className="feedback-panel">
                        <h3>Анализ хода</h3>
                        <p><strong>Качество:</strong> {feedback.strength}</p>
                        <p><strong>Рекомендация:</strong> {feedback.suggestion}</p>
                        {feedback.patternFeedback && feedback.patternFeedback.length > 0 && (
                            <div className="patterns">
                                <h4>Замечено:</h4>
                                <ul>
                                    {feedback.patternFeedback.map((pattern, i) => (
                                        <li key={i}>{pattern}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                
                {gameAnalysis && (
                    <div className="analysis-panel">
                        <h3>Анализ игры</h3>
                        <div className="analysis-section">
                            <h4>Уровень игры:</h4>
                            <p>{gameAnalysis.skillProfile.level}</p>
                        </div>
                        <div className="analysis-section">
                            <h4>Точность:</h4>
                            <p>{gameAnalysis.skillProfile.accuracy}%</p>
                        </div>
                        <div className="analysis-section">
                            <h4>Рекомендации:</h4>
                            <ul>
                                {gameAnalysis.recommendations.map((rec, i) => (
                                    <li key={i}>
                                        <strong>{rec.topic}</strong> ({rec.type})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}