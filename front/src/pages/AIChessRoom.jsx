import React, { useState, useEffect, useRef } from 'react';
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
    const [, setFeedback] = useState(null);
    const [gameAnalysis, setGameAnalysis] = useState(null);
    const [playerColor, setPlayerColor] = useState('white');
    const [isThinking, setIsThinking] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [, setAnalysisError] = useState(null);
    const gameRef = useRef(game);
    const [moveHistory, setMoveHistory] = useState([]);

    // Update ref when game changes
    useEffect(() => {
        gameRef.current = game;
    }, [game]);

    useEffect(() => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setGameOverMessage(null);
        setFeedback(null);
        setGameAnalysis(null);
        setAnalysisError(null);

        // If player is black, make AI move first
        if (playerColor === 'black') {
            setIsThinking(true);
            setTimeout(makeAIMove, 500);
        }
    }, [playerColor]);

    useEffect(() => {
        if (!gameOverMessage && game.turn() !== playerColor[0] && !isThinking) {
            setIsThinking(true);
            setTimeout(makeAIMove, 500);
        }
    }, [fen, gameOverMessage]);

    const checkGameOver = (gameInstance) => {
        if (gameInstance.isGameOver()) {
            let message = '';
            if (gameInstance.isCheckmate()) {
                const winner = gameInstance.turn() === 'w' ? 'Чёрные' : 'Белые';
                message = `${winner} победили (мат)`;
            } else if (gameInstance.isStalemate()) {
                message = 'Пат (ничья)';
            } else if (gameInstance.isDraw()) {
                message = 'Ничья';
                if (gameInstance.isThreefoldRepetition()) {
                    message += ' (троекратное повторение)';
                } else if (gameInstance.isInsufficientMaterial()) {
                    message += ' (недостаточно материала)';
                } else if (gameInstance.isDraw()) {
                    message += ' (по правилу 50 ходов)';
                }
            } else {
                message = 'Игра окончена';
            }
            setGameOverMessage(message);
            return true;
        }
        return false;
    };

    const makeAIMove = async () => {
        if (gameRef.current.isGameOver()) return;

        try {
            const response = await axios.post('http://localhost:5001/get-ai-move', {
                fen: gameRef.current.fen(),
                skillLevel: aiLevel
            });

            const newGame = new Chess(gameRef.current.fen());
            newGame.move(response.data.move);

            setMoveHistory(prev => [...prev, {
            from: response.data.move.substring(0,2),
            to: response.data.move.substring(2,4),
            san: newGame.history().slice(-1)[0]
        }]);

            setGame(newGame);
            setFen(newGame.fen());
            
            const isOver = checkGameOver(newGame);
            if (isOver && (feedbackMode === 'end' || feedbackMode === 'both')) {
                analyzeGame();
            }
        } catch (error) {
            console.error('AI move error:', error);
        } finally {
            setIsThinking(false);
        }
    };
    const generateCompletePGN = () => {
    const headers = [
        `[Event "Casual Game"]`,
        `[Site "Chess App"]`,
        `[Date "${new Date().toISOString().split('T')[0]}"]`,
        `[Round "-"]`,
        `[White "${playerColor === 'white' ? 'Player' : 'AI'}"]`,
        `[Black "${playerColor === 'black' ? 'Player' : 'AI'}"]`,
        `[Result "*"]`
    ].join('\n');

    const moves = [];
    const tempGame = new Chess();
    
    // Replay all moves to get proper SAN notation
    moveHistory.forEach(move => {
        const tempMove = tempGame.move({
            from: move.from,
            to: move.to,
            promotion: 'q'
        });
        moves.push(tempMove ? `${tempGame.history().slice(-1)[0]}` : 'invalid');
    });

    return `${headers}\n\n${moves.join(' ')} *`;
};

    const analyzeMove = async (move) => {
        try {
            const response = await axios.post("http://localhost:5001/analyze-move", { 
                fen: gameRef.current.fen(), 
                move 
            });
            setFeedback(response.data);
        } catch (error) {
            console.error('Move analysis error:', error);
            setFeedback({
                strength: "Analysis unavailable",
                suggestion: "Could not analyze this move",
                patternFeedback: []
            });
        }
    };

    const analyzeGame = async () => {
    const pgn = generateCompletePGN();
    console.log("Analyzing game with", game.history().length, "moves");
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
        const response = await axios.post('http://localhost:5001/analyze-game', { 
            pgn: pgn,
            playerColor
        }, {
            timeout: 60000  // 60 second timeout for long games
        });
        console.log(pgn)
        
        if (response.data.error) {
            throw new Error(response.data.error);
        }
        
        console.log("Analysis complete for", response.data.total_moves, "moves");
        setGameAnalysis(response.data);
        
    } catch (error) {
        console.error('Analysis failed:', error);
        setAnalysisError(error.message);
        
        // Provide fallback analysis
        setGameAnalysis({
            skill_profile: {
                level: "unknown",
                accuracy_percentage: 0,
                weaknesses: ["Analysis incomplete"]
            },
            recommendations: [
                {type: "system", format: "Try shorter game", priority: "high"}
            ]
        });
    } finally {
        setIsAnalyzing(false);
    }
};

    const handleReset = () => {
        const newGame = new Chess();
        setGame(newGame);
        setFen(newGame.fen());
        setGameOverMessage(null);
        setFeedback(null);
        setGameAnalysis(null);
        setAnalysisError(null);
        setIsThinking(false);
        setMoveHistory([]);

        // If player is black, make AI move first after reset
        if (playerColor === 'black') {
            setIsThinking(true);
            setTimeout(makeAIMove, 500);
        }
    };

    const onDrop = async (sourceSquare, targetSquare) => {
        if (gameRef.current.turn() !== playerColor[0] || gameOverMessage) {
            return false;
        }

        const move = {
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        };

        try {
            const newGame = new Chess(gameRef.current.fen());
            const result = newGame.move(move);
            if (!result) return false;

            setMoveHistory(prev => [...prev, {
            from: sourceSquare,
            to: targetSquare,
            san: newGame.history().slice(-1)[0] // Get SAN notation
        }]);

            setGame(newGame);
            setFen(newGame.fen());

            if (feedbackMode === 'instant' || feedbackMode === 'both') {
                await analyzeMove(`${sourceSquare}${targetSquare}`);
            }

            const isOver = checkGameOver(newGame);
            if (isOver && (feedbackMode === 'end' || feedbackMode === 'both')) {
                await analyzeGame();
            }
            return true;
        } catch {
            return false;
        }
    };

    return (
    <div className="ai-chess-room">
        <div className="chess-and-feedback-container">
            <div className="chess-section">
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
                        <h3>{gameOverMessage}</h3>
                    </div>
                )}
            </div>

            <div className="feedback-section">
                <div className="controls-and-analysis">
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
                                Режим анализа:
                                <select 
                                    value={feedbackMode}
                                    onChange={(e) => setFeedbackMode(e.target.value)}
                                >
                                    <option value="instant">Мгновенный</option>
                                    <option value="end">После игры</option>
                                    <option value="both">Оба режима</option>
                                </select>
                            </label>
                        </div>
                        
                        <button onClick={handleReset} className="control-button">
                            Новая игра
                        </button>
                        
                        {(feedbackMode === 'end' || feedbackMode === 'both') && game.isGameOver() && (
                            <button 
                                onClick={analyzeGame} 
                                className="control-button"
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing ? 'Анализируем...' : 'Полный анализ игры'}
                            </button>
                        )}
                    </div>

                    {gameAnalysis && (
                        <div className="analysis-panel">
                            <h3 className="analysis-title">📊 Подробный анализ партии</h3>
                            
                            <div className="analysis-section">
                                <h4 className="section-header">Общая оценка</h4>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-label">Уровень игры</span>
                                        <span className="stat-value highlight">
                                            {gameAnalysis.skill_profile.level}
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Общая точность</span>
                                        <span className="stat-value highlight">
                                            {gameAnalysis.skill_profile.accuracy_percentage}%
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Дебют</span>
                                        <span className="stat-value">
                                            {gameAnalysis.opening?.name || 'Неизвестный дебют'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="analysis-section">
                                <h4 className="section-header">Фазовый анализ</h4>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-label">Дебют</span>
                                        <span className="stat-value">
                                            {gameAnalysis.skill_profile.opening_accuracy}%
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Миттельшпиль</span>
                                        <span className="stat-value">
                                            {gameAnalysis.skill_profile.middlegame_accuracy}%
                                        </span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Эндшпиль</span>
                                        <span className="stat-value">
                                            {gameAnalysis.skill_profile.endgame_accuracy}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="analysis-section">
                                <h4 className="section-header">Ключевые моменты</h4>
                                <div className="key-moments">
                                    <div className="move-card best-move">
                                        <div className="move-header">
                                            <span className="move-icon">🏆</span>
                                            <h5>Лучший ход</h5>
                                        </div>
                                        <p className="move-description">
                                            {gameAnalysis.best_move.description}
                                        </p>
                                        <div className="move-phase">
                                            Этап: {gameAnalysis.best_move.phase}
                                        </div>
                                    </div>
                                    
                                    <div className="move-card worst-move">
                                        <div className="move-header">
                                            <span className="move-icon">⚠️</span>
                                            <h5>Слабый ход</h5>
                                        </div>
                                        <p className="move-description">
                                            {gameAnalysis.worst_move.description}
                                        </p>
                                        <div className="move-phase">
                                            Этап: {gameAnalysis.worst_move.phase}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="analysis-section">
                                <h4 className="section-header">Рекомендации</h4>
                                <div className="recommendations-list">
                                    {gameAnalysis.recommendations.map((rec, i) => (
                                        <div key={i} className={`recommendation-card priority-${rec.priority}`}>
                                            <div className="recommendation-content">
                                                <h5 className="rec-title">{rec.title}</h5>
                                                <p className="rec-description">{rec.description}</p>
                                            </div>
                                            <span className="rec-priority">
                                                {rec.priority === 'high' && '🔥 Высокий приоритет'}
                                                {rec.priority === 'medium' && '⏳ Средний приоритет'}
                                                {rec.priority === 'low' && '💡 Низкий приоритет'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);
}