import React from 'react';
import styles from '../../styles/roomPage.module.css';

export default function MoveHistory({ history, currentMoveIndex, onMoveClick }) {
    const moves = [];
    let whiteMove = null;
    let blackMove = null;

    history.forEach((move, index) => {
        if (index % 2 === 0) {
            whiteMove = move;
            if (index === history.length - 1) {
                moves.push(
                    <div key={index} className={styles["move-pair"]}>
                        <span className={styles["move-number"]}>{Math.floor(index / 2) + 1}.</span>
                        <button
                            className={`${styles["move-button"]} ${currentMoveIndex === index ? styles["current-move"] : ''}`}
                            onClick={() => onMoveClick(index)}
                        >
                            {whiteMove.san}
                        </button>
                    </div>
                );
            }
        } else {
            blackMove = move;
            moves.push(
                <div key={index} className={styles["move-pair"]}>
                    <span className={styles["move-number"]}>{Math.floor(index / 2) + 1}.</span>
                    <button
                        className={`${styles["move-button"]} ${currentMoveIndex === index - 1 ? styles["current-move"] : ''}`}
                        onClick={() => onMoveClick(index - 1)}
                    >
                        {whiteMove.san}
                    </button>
                    <button
                        className={`${styles["move-button"]} ${currentMoveIndex === index ? styles["current-move"] : ''}`}
                        onClick={() => onMoveClick(index)}
                    >
                        {blackMove.san}
                    </button>
                </div>
            );
        }
    });

    return (
        <div>
            <h3>Move History</h3>
            <div className={styles["move-history-list"]}>
                {moves}
            </div>
        </div>
    );
}