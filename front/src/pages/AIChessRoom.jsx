import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import axios from 'axios';
import axios2 from "../axiosInstance.js";
import '../styles/AIChessRoom.css';
import { Trophy, AlertTriangle, BarChart } from 'lucide-react';
import {
    handleCreateGame,
    handleLoadGame,
    handleSaveAiMove,
    handleSaveGame,
    handleSaveGameAnalysis,
    handleSaveMove
} from "../handlers/student/gameHandlers.js";
import {useParams, useSearchParams} from "react-router";


export default function AIChessRoom() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const colorParam = searchParams.get('color');
    const [currentUser, setCurrentUser] = useState(null);

    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState('start');
    const [gameOverMessage, setGameOverMessage] = useState(null);
    const [feedbackMode, setFeedbackMode] = useState('instant');
    const [aiLevel, ] = useState(3);
    const [feedback, setFeedback] = useState(null);
    const [gameAnalysis, setGameAnalysis] = useState(null);
    const [playerColor, setPlayerColor] = useState(colorParam || 'white');
    const [isThinking, setIsThinking] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [, setAnalysisError] = useState(null);
    const gameRef = useRef(game);
    const [moveHistory, setMoveHistory] = useState([]);
    const [mlInsights, ] = useState(null);
    const [boardSize, setBoardSize] = useState(Math.min(window.innerHeight * 0.8, 800));
    const [isLoading, setIsLoading] = useState(true);

    const makeAIMove = async () => {
        if (gameRef.current.isGameOver()) return;

        try {
            const response = await axios.post(`${import.meta.env.VITE_AI_API_URL}/get-ai-move`, {
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

            const request = {
                fromSquare: response.data.move.substring(0,2),
                toSquare: response.data.move.substring(2,4),
                san: newGame.history().slice(-1)[0],
                fenBefore: gameRef.current.fen(),
                fenAfter: newGame.fen()
            };

            handleSaveAiMove(id, request).then();

            setGame(newGame);
            setFen(newGame.fen());

            const isOver = checkGameOver(newGame);
            if (isOver) {
                let result;
                if (newGame.isCheckmate()) {
                    result = newGame.turn() === 'w' ? 'BLACK_WON' : 'WHITE_WON';
                } else if (newGame.isDraw()) {
                    result = 'DRAW';
                } else if (newGame.isStalemate()) {
                    result = 'STALEMATE';
                } else {
                    result = 'ABANDONED';
                }
                const gameRequest = {
                    result: result
                }
                handleSaveGame(id, gameRequest).then();

                if (feedbackMode === 'end' || feedbackMode === 'both') {
                    analyzeGame().then();
                }
            }
        } catch (error) {
            console.error('AI move error:', error);
        } finally {
            setIsThinking(false);
        }
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axios2.get(`/me`);
                setCurrentUser(response.data);
                console.log("Current user received")
            } catch (error) {
                console.error("Error fetching current user", error);
            }
        };

        fetchCurrentUser().then();
    }, []);

    useEffect(() => {
        gameRef.current = game;
    }, [game]);

    useEffect(() => {
        const handleResize = () => {
            setBoardSize(Math.min(window.innerHeight * 0.8, 800));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const loadGameState = async () => {
            try {
                const response = await handleLoadGame(id);
                if (response) {
                    setPlayerColor(response.playerColor || 'white');

                    const tempGame = new Chess();
                    const loadedMoveHistory = [];

                    response.moves.forEach(move => {
                        try {
                            const chessMove = tempGame.move({
                                from: move.fromSquare,
                                to: move.toSquare,
                                promotion: 'q'
                            });
                            if (chessMove) {
                                loadedMoveHistory.push({
                                    from: move.fromSquare,
                                    to: move.toSquare,
                                    san: move.san
                                });
                            }
                        } catch (e) {
                            console.error("Error loading move:", move, e);
                        }
                    });

                    setMoveHistory(loadedMoveHistory);
                    setGame(tempGame);
                    setFen(tempGame.fen());
                    gameRef.current = tempGame;

                    if (response.result) {
                        let message;
                        switch(response.result) {
                            case 'WHITE_WON':
                                message = 'White wins by checkmate';
                                break;
                            case 'BLACK_WON':
                                message = 'Black wins by checkmate';
                                break;
                            case 'DRAW':
                                message = 'Draw';
                                break;
                            case 'STALEMATE':
                                message = 'Stalemate (draw)';
                                break;
                            default:
                                message = 'Game over';
                        }
                        setGameOverMessage(message);
                    }
                }
            } catch (error) {
                console.error('Failed to load game:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadGameState().then();
    }, [id]);

    useEffect(() => {
        if (!gameOverMessage && game.turn() !== playerColor[0] && !isThinking) {
            setIsThinking(true);
            setTimeout(makeAIMove, 500);
        }
    }, [fen, gameOverMessage]);

    if (isLoading) {
        return <div className="loading-overlay">Loading game...</div>;
    }

    const handleColorChange = async (e) => {
        const newColor = e.target.value;
        try {
            const response = await handleCreateGame({
                userId: currentUser.id,
                playerColor: newColor
            });

            window.location.href = `/ai-room/${response}?color=${newColor}`;
        } catch (error) {
            console.error('Error creating new game:', error);
        }
    };

    const checkGameOver = (gameInstance) => {
        if (gameInstance.isGameOver()) {
            let message;
            if (gameInstance.isCheckmate()) {
                const winner = gameInstance.turn() === 'w' ? 'Black' : 'White';
                message = `${winner} wins by checkmate`;
            } else if (gameInstance.isStalemate()) {
                message = 'Stalemate (draw)';
            } else if (gameInstance.isDraw()) {
                message = 'Draw';
                if (gameInstance.isThreefoldRepetition()) {
                    message += ' (threefold repetition)';
                } else if (gameInstance.isInsufficientMaterial()) {
                    message += ' (insufficient material)';
                } else if (gameInstance.isDraw()) {
                    message += ' (50-move rule)';
                }
            } else {
                message = 'Game over';
            }
            setGameOverMessage(message);
            return true;
        }
        return false;
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

        const tempGame = new Chess();
        const sanMoves = [];
        
        moveHistory.forEach(move => {
            try {
                const chessMove = tempGame.move({
                    from: move.from,
                    to: move.to,
                    promotion: move.promotion || 'q'
                });
                if (chessMove) {
                    sanMoves.push(chessMove.san);
                }
            } catch (e) {
                console.error("Error processing move:", move, e);
            }
        });

        return `${headers}\n\n${sanMoves.join(' ')} *`;
    };

    const analyzeMove = async (move, moveRequest) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_AI_API_URL}/analyze-move`, { 
                fen: gameRef.current.fen(), 
                move 
            });
            setFeedback({
                ...response.data,
                mlCategory: response.data.ml_category || response.data.category
            });

            const analysisRequest = {
                strength: response.data.strength,
                suggestion: response.data.suggestion,
                topSuggestion: response.data.top_suggestion,
                category: response.data.category.toUpperCase()
            }

            const request = {
                move: moveRequest,
                moveAnalysis: analysisRequest
            }

            handleSaveMove(id, request).then()
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
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_AI_API_URL}/analyze-game`, { 
                pgn: pgn,
                debug: true
            }, { timeout: 60000 });

            const raw = response.data;
            const data = raw.move_analyses || raw;

            let opening = data.opening;
            if (opening === "Unknown opening") {
                const firstMoves = game.history().slice(0, 4).join(" ");
                opening = `Unknown opening (${firstMoves})`;
            }

            setGameAnalysis({
                ...data,
                opening: opening,
                mlData: {
                    skillLevel: data.skill_profile?.level || "unknown",
                    anomalies: data.anomalies || [],
                    opening: opening
                }
            });

            const request = {
                accuracyScore: gameAnalysis?.skill_profile?.accuracy_percentage || null,
                opening: gameAnalysis?.opening || null,
                skillLevel: gameAnalysis?.skill_profile?.level || null
            }

            handleSaveGameAnalysis(id, request).then();

        } catch (error) {
            console.error('Analysis failed:', error);
            setAnalysisError(error.message);

            const sanHistory = game.history();
            const firstMoves = sanHistory.slice(0, 4).join(" ");

            setGameAnalysis({
                skill_profile: {
                    level: "unknown",
                    accuracy_percentage: 0,
                    weaknesses: ["Analysis incomplete"],
                },
                opening: `Unknown opening (error: ${firstMoves})`,
                mlData: {
                    skillLevel: "unknown",
                    anomalies: [],
                    opening: `Unknown opening (error: ${firstMoves})`
                }
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = async () => {
        try {
            const response = await handleCreateGame({
                userId: currentUser.id,
                playerColor: 'white'
            });

            window.location.href = `/ai-room/${response}?color=white`;
        } catch (error) {
            console.error('Error creating new game:', error);
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

            const request = {
                fromSquare: sourceSquare,
                toSquare: targetSquare,
                san: newGame.history().slice(-1)[0],
                fenBefore: gameRef.current.fen(),
                fenAfter: newGame.fen(),
                isPlayerMove: true
            };

            setGame(newGame);
            setFen(newGame.fen());

            if (feedbackMode === 'instant' || feedbackMode === 'both') {
                await analyzeMove(`${sourceSquare}${targetSquare}`, request);
            }

            const isOver = checkGameOver(newGame);
            if (isOver) {
                let result;
                if (newGame.isCheckmate()) {
                    result = newGame.turn() === 'w' ? 'BLACK_WON' : 'WHITE_WON';
                } else if (newGame.isDraw()) {
                    result = 'DRAW';
                } else if (newGame.isStalemate()) {
                    result = 'STALEMATE';
                } else {
                    result = 'ABANDONED';
                }
                const gameRequest = {
                    result: result
                }
                handleSaveGame(id, gameRequest).then();

                if (feedbackMode === 'end' || feedbackMode === 'both') {
                    analyzeGame().then();
                }
            }
            return true;
        } catch {
            return false;
        }
    };
    
    const renderMLInsights = () => {
        if (!mlInsights) return null;
        
        return (
            <div className="analysis-section">
                <h4 className="section-header">ML Insights</h4>
                <div className="ml-insights-grid">
                    <div className="ml-insight-card">
                        <h5>Skill Level</h5>
                        <div className="ml-value">{gameAnalysis.skill_profile?.level || 'unknown'}</div>
                    </div>
                    
                    <div className="ml-insight-card">
                        <h5>Opening</h5>
                        <div className="ml-value">{gameAnalysis.opening}</div>
                    </div>
                    
                    {gameAnalysis.skill_profile.weaknesses?.length > 0 && (
                        <div className="ml-insight-card">
                            <h5>Main Weaknesses</h5>
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
                            boardWidth={boardSize}
                            boardOrientation={playerColor}
                            customBoardStyle={{
                                borderRadius: '4px',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                                width: '100%',
                                height: '100%'
                            }}
                        />
                        {isThinking && <div className="thinking-overlay">AI thinking...</div>}
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
    <div className="control-row">
        <div className="control-group">
            <label>Color:</label>
            <select 
                value={playerColor}
                onChange={handleColorChange}
                // disabled={game.history().length > 0}
            >
                <option value="white">White</option>
                <option value="black">Black</option>
            </select>
        </div>

        

        <div className="control-group">
            <label>Analysis Mode:</label>
            <select 
                value={feedbackMode}
                onChange={(e) => setFeedbackMode(e.target.value)}
            >
                <option value="instant">Instant</option>
                <option value="end">After game</option>
                <option value="both">Both</option>
            </select>
        </div>
    </div>

    <div className="control-buttons-row">
        <button onClick={handleReset} className="control-button">
            New Game
        </button>

        {(feedbackMode === 'end' || feedbackMode === 'both') && game.isGameOver() && (
            <button 
                onClick={analyzeGame} 
                className="control-button"
                disabled={isAnalyzing}
            >
                {isAnalyzing ? 'Analyzing...' : 'Full Game Analysis'}
            </button>
        )}
    </div>
</div>


                        {feedback && (feedbackMode === 'instant' || feedbackMode === 'both') && (
                            <div className="feedback-panel">
                                <h3 className="analysis-title">
  <BarChart size={18} className="title-icon" />
  Move Analysis
</h3>

                                <div className="analysis-section">
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <span className="stat-label">Move Quality</span>
                                            <span className="stat-value highlight">
                                                {feedback.strength}
                                                {renderSourceBadge("Stockfish")}
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">ML Category</span>
                                            <span className={`stat-value ml-category-${feedback.mlCategory}`}>
                                                {feedback.mlCategory}
                                                {renderSourceBadge("AI Model")}
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Suggestion</span>
                                            <span className="stat-value">
                                                {feedback.suggestion}
                                                {renderSourceBadge("System")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {gameAnalysis && (
                            <div className="analysis-panel">
                                <h3 className="analysis-title">
  <BarChart size={18} className="title-icon" /> Detailed Game Analysis
</h3>

                                
                                <div className="analysis-section">
                                    <h4 className="section-header">Overall Assessment</h4>
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <span className="stat-label">Skill Level</span>
                                            <span className="stat-value highlight">
                                                {gameAnalysis.skill_profile?.level || 'unknown'}
                                                {renderSourceBadge("Stockfish")}
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Accuracy</span>
                                            <span className="stat-value highlight">
                                                {gameAnalysis.skill_profile?.accuracy_percentage ?? 0}%
                                                {renderSourceBadge("Stockfish")}
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Opening</span>
                                            <span className="stat-value">
                                                {gameAnalysis.opening || 'Unknown opening'}
                                                {renderSourceBadge("System")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {renderMLInsights()}

                                <div className="analysis-section">
                                    <h4 className="section-header">Key Moments</h4>
                                    <div className="key-moments">
                                        <div className="move-card best-move">
                                            <div className="move-header">
                                                <Trophy size={18} className="move-icon" />

                                                <h5>Best Move</h5>
                                            </div>
                                            <p className="move-description">
                                                {gameAnalysis.best_move?.description || "No best move detected"}
                                                {renderSourceBadge("Stockfish")}
                                            </p>
                                            <div className="move-phase">
                                                Phase: {gameAnalysis.best_move?.phase || "unknown"}
                                            </div>
                                        </div>
                                        
                                        <div className="move-card worst-move">
                                            <div className="move-header">
                                                <AlertTriangle size={18} className="move-icon" />

                                                <h5>Weak Move</h5>
                                            </div>
                                            <p className="move-description">
                                                {gameAnalysis.worst_move?.description || "No worst move detected"}
                                                {renderSourceBadge("Stockfish")}
                                            </p>
                                            <div className="move-phase">
                                                Phase: {gameAnalysis.worst_move?.phase || "unknown"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="analysis-section">
                                    <h4 className="section-header">Recommendations</h4>
                                    <div className="recommendations-list">
                                        {gameAnalysis.recommendations?.map((rec, i) => (
                                            <div key={i} className={`recommendation-card priority-${rec.priority}`}>
                                                <div className="recommendation-content">
                                                    <h5 className="rec-title">
                                                        {rec.title || rec.format}
                                                        <span className="source-badge source-system">System</span>
                                                    </h5>
                                                    <p className="rec-description">{rec.description}</p>
<p className="rec-explanation">
  <AlertTriangle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
  {rec.explanation}
</p>


                                                </div>
                                                <span className="rec-priority">
                                                    {rec.priority === 'high' && (
  <>
    <AlertTriangle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
    High priority
  </>
)}
{rec.priority === 'medium' && (
  <>
    <BarChart size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
    Medium priority
  </>
)}
{rec.priority === 'low' && (
  <>
    <Trophy size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
    Low priority
  </>
)}

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