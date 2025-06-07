import numpy as np


class ChessVectorizer:
    def transform(self, move_analyses: list) -> np.ndarray:
        """
        Convert move_analyses into a 896-dim fixed vector: 32 moves × 28 features
        Supports any number of moves with truncation/padding
        """
        max_moves = 32
        features_per_move = 28

        def move_to_vec(move):
            vec = []

            piece_map = {
                "pawn": [1, 0, 0, 0, 0, 0],
                "knight": [0, 1, 0, 0, 0, 0],
                "bishop": [0, 0, 1, 0, 0, 0],
                "rook": [0, 0, 0, 1, 0, 0],
                "queen": [0, 0, 0, 0, 1, 0],
                "king": [0, 0, 0, 0, 0, 1],
            }
            vec.extend(piece_map.get(move.get("piece", ""), [0] * 6))

            category_score = {
                "excellent": 1.0,
                "good": 0.8,
                "ok": 0.6,
                "poor": 0.4,
                "mistake": 0.2,
                "blunder": 0.0,
            }
            vec.append(category_score.get(move.get("category", ""), 0.5))

            phase_map = {
                "opening": [1, 0, 0],
                "middlegame": [0, 1, 0],
                "endgame": [0, 0, 1],
            }
            vec.extend(phase_map.get(move.get("phase", ""), [0] * 3))

            eval_score = move.get("eval", 0)
            if eval_score is None:
                eval_score = 0
            vec.append(np.clip(eval_score, -1000, 1000) / 1000)

            # Padding to 28 features
            while len(vec) < features_per_move:
                vec.append(0.0)

            return vec

        # Apply to all moves
        feature_vectors = [move_to_vec(m) for m in move_analyses]

        # If more than max_moves, truncate
        if len(feature_vectors) > max_moves:
            feature_vectors = feature_vectors[:max_moves]

        # If fewer, pad with zeros
        while len(feature_vectors) < max_moves:
            feature_vectors.append([0.0] * features_per_move)

        # Flatten
        return np.array(feature_vectors).flatten()
