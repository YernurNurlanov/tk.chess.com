import chess
import numpy as np


def extract_features(board):
    """Extract basic features from board position"""
    features = []

    # Material balance
    material = {
        "P": 1,
        "N": 3,
        "B": 3,
        "R": 5,
        "Q": 9,
        "K": 0,
        "p": -1,
        "n": -3,
        "b": -3,
        "r": -5,
        "q": -9,
        "k": 0,
    }
    total = 0
    for piece in board.piece_map().values():
        total += material.get(piece.symbol(), 0)
    features.append(total)

    # King safety
    features.append(len(board.attacks(board.king(chess.WHITE))))
    features.append(len(board.attacks(board.king(chess.BLACK))))

    # Pawn structure
    features.append(len(board.pieces(chess.PAWN, chess.WHITE)))
    features.append(len(board.pieces(chess.PAWN, chess.BLACK)))

    return np.array(features)
