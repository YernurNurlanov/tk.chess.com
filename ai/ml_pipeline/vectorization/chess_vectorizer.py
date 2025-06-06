import chess
import numpy as np


class ChessVectorizer:
    def board_to_vector(self, board):
        """Convert chess board to feature vector"""
        vector = []

        # Piece-centric features
        for piece_type in [
            chess.PAWN,
            chess.KNIGHT,
            chess.BISHOP,
            chess.ROOK,
            chess.QUEEN,
            chess.KING,
        ]:
            for color in [chess.WHITE, chess.BLACK]:
                # Count of pieces
                vector.append(len(board.pieces(piece_type, color)))

                # Positional features (center control, etc.)
                if piece_type != chess.KING:
                    center_squares = [chess.D4, chess.D5, chess.E4, chess.E5]
                    center_count = sum(
                        1
                        for sq in center_squares
                        if board.piece_at(sq)
                        and board.piece_at(sq).piece_type == piece_type
                        and board.piece_at(sq).color == color
                    )
                    vector.append(center_count)

        # Game state features
        vector.append(1 if board.turn == chess.WHITE else 0)
        vector.append(len(board.move_stack))  # move count
        vector.append(1 if board.is_check() else 0)

        # Castling rights
        vector.append(1 if board.has_kingside_castling_rights(chess.WHITE) else 0)
        vector.append(1 if board.has_queenside_castling_rights(chess.WHITE) else 0)
        vector.append(1 if board.has_kingside_castling_rights(chess.BLACK) else 0)
        vector.append(1 if board.has_queenside_castling_rights(chess.BLACK) else 0)

        return np.array(vector)
