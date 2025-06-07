import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import {handleCheckTask} from "../../handlers/student/lessonHandlers.js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo} from "@fortawesome/free-solid-svg-icons";

const TaskBoard = ({ task, studentId, setLessonTasks }) => {
    const [game, setGame] = useState(new Chess());
    const [position, setPosition] = useState(task.startFin || "start");
    const [isBlocked, setIsBlocked] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        const gameInstance = new Chess();
        try {
            gameInstance.load(task.startFin);
            setGame(gameInstance);
            setPosition(task.startFin);
        } catch {
            setGame(new Chess()); // fallback
        }
        setIsBlocked(task.completed || task.attemptNumber >= 3 && !task.completed);
    }, [task]);

    const getPositionOnly = (fen) => fen.split(' ')[0];

    const onDrop = (sourceSquare, targetSquare) => {

        const newGame = new Chess(game.fen());
        const move = newGame.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        if (move === null) return false;

        setGame(newGame);
        setPosition(newGame.fen());
        const currentPosition = getPositionOnly(newGame.fen());
        const expectedPosition = getPositionOnly(task.endFin);

        if (currentPosition === expectedPosition) {
            const updatedTask = { ...task, completed: true };
            handleCheckTask(studentId, updatedTask).then((updated) => {
                setLessonTasks(prev =>
                    prev.map(t =>
                        t.taskId === updated.taskId
                            ? {
                                ...t,
                                completed: updated.completed,
                                completedAt: updated.completedAt,
                                attemptNumber: updated.attemptNumber
                            }
                            : t
                    )
                );
            });
        } else if (newGame.history().length >= 1) {
            const updatedTask = { ...task, completed: false };
            handleCheckTask(studentId, updatedTask).then((updated) => {
                setLessonTasks(prev =>
                    prev.map(t =>
                        t.taskId === updated.taskId
                            ? {
                                ...t,
                                completed: updated.completed,
                                completedAt: updated.completedAt,
                                attemptNumber: updated.attemptNumber
                            }
                            : t
                    )
                );
            });
        }

        return true;
    };

    return (
        <div style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            background: "#fafafa",
            padding: "1rem",
            borderRadius: "12px",
            boxShadow: "0 0 6px rgba(0,0,0,0.1)"
        }}>
            <div style={{ pointerEvents: isBlocked ? "none" : "auto", opacity: isBlocked ? 0.5 : 1 }}>
                <Chessboard
                    position={position}
                    onPieceDrop={onDrop}
                    arePiecesDraggable={!isBlocked}
                    boardWidth={350}
                />
            </div>
            <div style={{minWidth: "200px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <p><strong>Topic:</strong> {task.topic}</p>
                <p><strong>Level:</strong> {task.level}</p>
                <p><strong>Completed:</strong> {task.completed ? "✅" : "❌"}</p>
                <p><strong>Attempts:</strong> {task.attemptNumber}</p>
                <p>
                    <strong>Completed at:</strong>{" "}
                    {task.completedAt ? new Date(task.completedAt).toLocaleString() : "—"}
                </p>

                {isBlocked && (
                    <button
                        onClick={() => setShowAnswer(prev => !prev)}
                        style={{...buttonStyle, backgroundColor: "#f88"}}
                    >
                        {showAnswer ? "🙈 Hide answer" : "👁 Show answer"}
                    </button>
                )}

                {showAnswer && (
                    <div style={{marginTop: "1rem"}}>
                        <strong>Answer (final position):</strong>
                        <Chessboard position={task.endFin} boardWidth={200} arePiecesDraggable={false}/>
                    </div>
                )}
            </div>
        </div>
    );
};

const buttonStyle = {
    padding: "0.5rem",
    marginTop: "0.5rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer",
    backgroundColor: "#eee"
};

const TasksSection = ({ studentId, selectedLesson, lessonTasks, setLessonTasks }) => {
    return (
        <section style={{ padding: "2rem" }}>
            {selectedLesson && (
                <h2 style={{ marginBottom: "2rem" }}>
                    Lesson: {selectedLesson.groupName} |
                    {new Date(selectedLesson.startTime).toLocaleDateString()}&nbsp;
                    {new Date(selectedLesson.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    &mdash;
                    {new Date(selectedLesson.endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </h2>
            )}
            {lessonTasks?.length === 0 ? (
                <div className="empty-state">
                    <FontAwesomeIcon icon={faCircleInfo} className="empty-icon" />
                    <span>There are no tasks yet.</span>
                </div>
            ) : (
                <>
                    {lessonTasks?.map(task => (
                        <TaskBoard key={task.taskId}
                                   task={task}
                                   studentId={studentId}
                                   setLessonTasks={setLessonTasks}
                        />
                    ))}
                    {!selectedLesson && !lessonTasks && (
                        <p style={{color: "gray", fontStyle: "italic"}}>
                            To view homework, select a lesson in the lessons section.
                        </p>
                    )}
                </>
            )}
        </section>
    );
};

export default TasksSection;
