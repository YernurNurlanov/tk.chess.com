import chess
import numpy as np


class ChessVectorizer:
    PIECE_MAP = {
        "P": 0,
        "N": 1,
        "B": 2,
        "R": 3,
        "Q": 4,
        "K": 5,
        "p": 6,
        "n": 7,
        "b": 8,
        "r": 9,
        "q": 10,
        "k": 11,
    }

    def board_to_vector(self, board: chess.Board) -> np.ndarray:
        """Convert board to 8x8x14 tensor"""
        tensor = np.zeros((8, 8, 14), dtype=np.float32)

        # Piece positions
        for square, piece in board.piece_map().items():
            rank, file = divmod(square, 8)
            piece_idx = self.PIECE_MAP[piece.symbol()]
            tensor[7 - rank, file, piece_idx] = 1

        # Castling rights
        tensor[:, :, 12] = board.has_kingside_castling_rights(chess.WHITE)
        tensor[:, :, 13] = board.has_queenside_castling_rights(chess.WHITE)

        return tensor.flatten()
