import chess
import chess.engine
import chess.pgn
import io
import numpy as np
from typing import Dict, Any, List
from .db_service import DBService
from .ml_service import MLService


class AnalysisService:
    def __init__(self, engine_path: str = "/opt/homebrew/bin/stockfish"):
        self.engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        self.ml = MLService()
        self.db = DBService()

    def analyze_position(self, fen: str) -> Dict[str, Any]:
        # Check cache first
        if cached := self.db.get_position(fen):
            return cached

        # Analyze with Stockfish
        board = chess.Board(fen)
        analysis = self.engine.analyse(board, chess.engine.Limit(depth=22), multipv=5)

        # Generate ML embedding
        embedding = self.ml.vectorizer.board_to_vector(board)

        # Store in DB
        self.db.save_position(fen, analysis, embedding)

        return {
            "evaluation": analysis,
            "ml_embedding": embedding.tolist(),  # Convert to list for JSON
        }

    def analyze_game(self, pgn: str) -> Dict[str, Any]:
        game = chess.pgn.read_game(io.StringIO(pgn))
        analyses = []
        embeddings = []

        board = game.board()

        for move in game.mainline_moves():
            # Analyze the current position
            position_analysis = self.analyze_position(board.fen())

            # Classify move quality
            move_quality = self.ml.classify_move(board, move)

            # Store analysis for this move
            move_analysis = {
                **position_analysis,
                "move_quality": move_quality,
                "is_anomaly": False,
                "fen_before": board.fen(),
                "move": move.uci(),
            }
            analyses.append(move_analysis)
            embeddings.append(position_analysis["ml_embedding"])

            # Push the move to the board
            board.push(move)

        # Detect anomalies
        if embeddings:
            anomalies = self.ml.detect_anomalies(embeddings)
            for i, anomaly in enumerate(anomalies):
                analyses[i]["is_anomaly"] = bool(anomaly)

            # Predict skill
            skill_profile = self.ml.predict_skill(embeddings)
        else:
            skill_profile = {"level": "unknown", "accuracy": 0}

        return {
            "skill_profile": skill_profile,
            "move_analyses": analyses,
        }
