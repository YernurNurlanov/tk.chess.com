import chess.pgn
import numpy as np
from tqdm import tqdm
import chess.engine
import os
from ml_pipeline.vectorization.chess_vectorizer import ChessVectorizer


def classify_move_quality(board, move, cp_before, cp_after):
    """
    Classify move quality based on centipawn loss
    :param board: The current board state
    :param move: The move made
    :param cp_before: Centipawn score before the move
    :param cp_after: Centipawn score after the move
    :return: Label (0: blunder, 1: mistake, 2: good, 3: excellent)
    """
    if cp_before is None or cp_after is None:
        return 2  # Default to good if mate scores

    # Calculate centipawn loss
    cp_loss = cp_before - cp_after

    if cp_loss > 300:
        return 0  # blunder
    elif cp_loss > 100:
        return 1  # mistake
    elif cp_loss > 0:
        return 2  # good
    else:
        return 3  # excellent (gained advantage)


def process_pgn(file_path, output_path, engine_path, samples=100000):
    """Process PGN file into training data"""
    # Initialize chess engine
    engine = chess.engine.SimpleEngine.popen_uci(engine_path)
    vectorizer = ChessVectorizer()

    X = []
    y = []
    ratings = []

    with open(file_path) as pgn:
        for _ in tqdm(range(samples), desc="Processing games"):
            game = chess.pgn.read_game(pgn)
            if not game:
                break

            board = game.board()
            white_rating = int(game.headers.get("WhiteElo", "1500"))
            black_rating = int(game.headers.get("BlackElo", "1500"))

            for move in game.mainline_moves():
                # Extract features
                features = vectorizer.board_to_vector(board)

                # Get evaluation before move
                info_before = engine.analyse(board, chess.engine.Limit(depth=15))
                cp_before = info_before["score"].relative.score()

                # Make the move
                board.push(move)

                # Get evaluation after move
                info_after = engine.analyse(board, chess.engine.Limit(depth=15))
                cp_after = info_after["score"].relative.score()

                # Classify move quality
                quality = classify_move_quality(board, move, cp_before, cp_after)

                X.append(features)
                y.append(quality)
                ratings.append((white_rating, black_rating))

    # Close engine
    engine.quit()

    # Save results
    np.savez(output_path, X=np.array(X), y=np.array(y), ratings=np.array(ratings))


if __name__ == "__main__":
    stockfish_path = "/opt/homebrew/bin/stockfish"  # Update to your path
    process_pgn(
        "data/processed/2019-05.pgn",
        "data/processed/2019-05_training_data.pgn",
        engine_path=stockfish_path,
        samples=1000,
    )
