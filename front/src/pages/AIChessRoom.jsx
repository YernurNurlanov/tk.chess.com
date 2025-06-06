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
    const [feedback, setFeedback] = useState(null);
    const [gameAnalysis, setGameAnalysis] = useState(null);
    const [playerColor, setPlayerColor] = useState('white');
    const [isThinking, setIsThinking] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [, setAnalysisError] = useState(null);
    const gameRef = useRef(game);
    const [moveHistory, setMoveHistory] = useState([]);
    const [mlInsights, setMlInsights] = useState(null);

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
        setMlInsights(null);

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

    // Reconstruct the game to get proper SAN moves
    const tempGame = new Chess();
    const sanMoves = [];
    
    moveHistory.forEach(move => {
        try {
            const chessMove = tempGame.move({
                from: move.from,
                to: move.to,
                promotion: move.promotion || 'q' // Default to queen promotion
            });
            if (chessMove) {
                sanMoves.push(chessMove.san);
            } else {
                console.error("Invalid move in history:", move);
            }
        } catch (e) {
            console.error("Error processing move:", move, e);
        }
    });

    const pgn = `${headers}\n\n${sanMoves.join(' ')} *`;
    console.log("Generated PGN:", pgn); // Log the complete PGN
    return pgn;
};

    const analyzeMove = async (move) => {
        try {
            const response = await axios.post("http://localhost:5001/analyze-move", { 
                fen: gameRef.current.fen(), 
                move 
            });
            
            // Enhanced feedback with ML insights
            setFeedback({
                ...response.data,
                mlCategory: response.data.ml_category || response.data.category
            });
        } catch (error) {
            console.error('Move analysis error:', error);
            setFeedback({
                strength: "Analysis unavailable",
                suggestion: "Could not analyze this move",
            });
        }
    };

    const analyzeGame = async () => {
    const pgn = generateCompletePGN();
    console.log("===== SENDING TO BACKEND =====");
    console.log("Full PGN:", pgn);
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
        const response = await axios.post('http://localhost:5001/analyze-game', { 
            pgn: pgn,
            playerColor,
            // debug: true  // Request detailed processing info
        }, { timeout: 60000 });

        console.log("Backend response:", response.data);
        
        // If opening is unknown, show first moves
        let opening = response.data.opening;
        if (opening === "Неизвестный дебют") {
            const firstMoves = game.history().slice(0, 4).join(" ");
            opening = `Неизвестный дебют (${firstMoves})`;
        }
        
        setGameAnalysis({
            ...response.data,
            opening: opening,
            mlData: {
                skillLevel: response.data.skill_profile?.level || "unknown",
                anomalies: response.data.anomalies || [],
                opening: opening
            }
        });
        
    } catch (error) {
        console.error('Analysis failed:', error);
        setAnalysisError(error.message);
        
        // Create detailed error analysis
        const sanHistory = game.history();
        const firstMoves = sanHistory.slice(0, 4).join(" ");
        
        setGameAnalysis({
            skill_profile: {
                level: "unknown",
                accuracy_percentage: 0,
                weaknesses: ["Анализ не завершен"],
            },
            opening: `Неизвестный дебют (ошибка: ${firstMoves})`,
            mlData: {
                skillLevel: "unknown",
                anomalies: [],
                opening: `Неизвестный дебют (ошибка: ${firstMoves})`
            }
        });
    } finally {
        setIsAnalyzing(false);
        console.log("===== ANALYSIS COMPLETE =====");
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
        setMlInsights(null);
        setIsThinking(false);
        setMoveHistory([]);

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
                san: newGame.history().slice(-1)[0]
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

    // Render ML insights section
    const renderMLInsights = () => {
        if (!mlInsights) return null;
        
        return (
            <div className="analysis-section">
                <h4 className="section-header">ML Insights</h4>
                <div className="ml-insights-grid">
                    <div className="ml-insight-card">
                        <h5>Уровень игры</h5>
                        <div className="ml-value">{gameAnalysis.skill_profile?.level || 'unknown'
}</div>
                    </div>
                    
                    <div className="ml-insight-card">
                        <h5>Дебют</h5>
                        <div className="ml-value">{gameAnalysis.opening}</div>
                    </div>
                    
                    {gameAnalysis.skill_profile.weaknesses?.length > 0 && (
                        <div className="ml-insight-card">
                            <h5>Основные слабости</h5>
                            <div className="weaknesses-list">
                                {gameAnalysis.skill_profile?.weaknesses?.map((weakness, i) => (
                                    <div key={i} className="weakness-item">
                                        {weakness}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

  
    const renderSourceBadge = (source) => {
        return (
            <span className={`source-badge source-${source.toLowerCase()}`}>
                {source}
            </span>
        );
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

                        {/* Instant Move Feedback */}
                        {feedback && (feedbackMode === 'instant' || feedbackMode === 'both') && (
                            <div className="feedback-panel">
                                <h3 className="analysis-title">📊 Анализ хода</h3>
                                <div className="analysis-section">
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <span className="stat-label">Качество хода</span>
                                            <span className="stat-value highlight">
                                                {feedback.strength}
                                                {renderSourceBadge("Stockfish")}
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">ML Категория</span>
                                            <span className={`stat-value ml-category-${feedback.mlCategory}`}>
                                                {feedback.mlCategory}
                                                {renderSourceBadge("AI Model")}
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Рекомендация</span>
                                            <span className="stat-value">
                                                {feedback.suggestion}
                                                {renderSourceBadge("System")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* Game Analysis */}
                        {gameAnalysis && (
                            <div className="analysis-panel">
                                <h3 className="analysis-title">📊 Подробный анализ партии</h3>
                                
                                <div className="analysis-section">
                                    <h4 className="section-header">Общая оценка</h4>
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <span className="stat-label">Уровень игры</span>
                                            <span className="stat-value highlight">
                                                {gameAnalysis.skill_profile?.level || 'unknown'}
                                                {renderSourceBadge("Stockfish")}
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Точность</span>
                                            <span className="stat-value highlight">
                                                {gameAnalysis.skill_profile?.accuracy_percentage ?? 0}%
                                                {renderSourceBadge("Stockfish")}
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                <span className="stat-label">Дебют</span>
                                <span className="stat-value">
                                    {gameAnalysis.opening || 'Неизвестный дебют'}
                                    {renderSourceBadge("System")}
                                </span>
                            </div>
                                    </div>
                                </div>

                                {/* ML Insights Section */}
                                {renderMLInsights()}
                                {/* {renderPieceAccuracy} */}

                                <div className="analysis-section">
                                    <h4 className="section-header">Ключевые моменты</h4>
                                    <div className="key-moments">
                                        <div className="move-card best-move">
                                            <div className="move-header">
                                                <span className="move-icon">🏆</span>
                                                <h5>Лучший ход</h5>
                                            </div>
                                            <p className="move-description">
                                                {gameAnalysis.best_move?.description || "No best move detected"}
                                                {renderSourceBadge("Stockfish")}
                                            </p>
                                            <div className="move-phase">
                                                Этап: {gameAnalysis.best_move?.phase || "unknown"}
                                            </div>
                                        </div>
                                        
                                        <div className="move-card worst-move">
                                            <div className="move-header">
                                                <span className="move-icon">⚠️</span>
                                                <h5>Слабый ход</h5>
                                            </div>
                                            <p className="move-description">
                                                {gameAnalysis.worst_move?.description || "No worst move detected"}
                                                {renderSourceBadge("Stockfish")}
                                            </p>
                                            <div className="move-phase">
                                                Этап: {gameAnalysis.worst_move?.phase || "unknown"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="analysis-section">
                                    <h4 className="section-header">Рекомендации</h4>
                                    <div className="recommendations-list">
                                        {gameAnalysis.recommendations?.map((rec, i) => (
                                            <div key={i} className={`recommendation-card priority-${rec.priority}`}>
                                                <div className="recommendation-content">
                                                    <h5 className="rec-title">
                                                        {rec.title || rec.format}
                                                        <span className="source-badge source-system">System</span>
                                                    </h5>
                                                    <p className="rec-description">{rec.description}</p>
                                                </div>
                                                <span className="rec-priority">
                                                    {rec.priority === 'high' && '🔥 Высокий приоритет'}
                                                    {rec.priority === 'medium' && '⏳ Средний приоритет'}
                                                    {rec.priority === 'low' && '💡 Низкий приоритет'}
                                                </span>
                                            </div>
                                        )) || <p>No recommendations available</p>}
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