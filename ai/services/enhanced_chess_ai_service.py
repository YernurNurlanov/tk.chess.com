import io
import chess
import chess.engine
import chess.pgn
import numpy as np
from typing import Dict, Any, List, Optional
from .analysis_service import AnalysisService
from .ml_service import MLService
from .feedback_service import FeedbackService
from .db_service import DBService
from .feedback_generator import FeedbackGenerator
from .skill_predictor import SkillPredictor
from .learning_path import LearningPath


class EnhancedChessAIService:
    def __init__(self, engine_path: str = "/opt/homebrew/bin/stockfish"):
        # Initialize engines and services
        self.engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        self.analysis_service = AnalysisService(engine_path)
        self.ml_service = MLService()
        self.feedback_service = FeedbackService()
        self.db_service = DBService()

        # Legacy services
        self.feedback_gen = FeedbackGenerator()
        self.skill_predictor = SkillPredictor()
        self.learning_path = LearningPath()

        self.player_history = []

    # ====================
    # Existing functionality
    # ====================

    def analyze_move(self, fen: str, move_uci: str) -> Dict[str, Any]:
        """Enhanced move analysis with personalized feedback"""
        # ... (keep your existing implementation) ...

    def generate_move(self, fen: str, skill_level: int = 3) -> Dict[str, Any]:
        """Generate AI move with adaptive skill"""
        # ... (keep your existing implementation) ...

    def analyze_pgn(self, pgn: str, player_color: str = "white") -> Dict[str, Any]:
        """Comprehensive game analysis with skill assessment"""
        # ... (keep your existing implementation) ...

    # ====================
    # New ML-powered functionality
    # ====================

    def analyze_position(self, fen: str) -> Dict[str, Any]:
        """ML-enhanced position analysis"""
        return self.analysis_service.analyze_position(fen)

    def analyze_full_game(
        self, pgn: str, game_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Full ML-powered game analysis"""
        result = self.analysis_service.analyze_game(pgn)

        # Save to DB if game_id provided
        if game_id:
            self.db_service.save_game_analysis(game_id, result["move_analyses"])

        return result

    def generate_feedback(self, analysis: Dict, history: List[Dict]) -> str:
        """Generate personalized feedback using ML"""
        return self.feedback_service.generate_feedback(analysis, history)

    # ====================
    # Hybrid functionality
    # ====================

    def analyze_game_with_ml(
        self, pgn: str, player_color: str = "white"
    ) -> Dict[str, Any]:
        """Hybrid analysis using both legacy and ML approaches"""
        # First get legacy analysis
        legacy_result = self.analyze_pgn(pgn, player_color)

        # Enhance with ML analysis
        ml_result = self.analyze_full_game(pgn)

        return {
            "legacy_analysis": legacy_result,
            "ml_analysis": ml_result,
            "combined_skill_level": self._combine_skill_assessments(
                legacy_result["skill_profile"], ml_result["skill_profile"]
            ),
        }

    def analyze_move_with_ml(self, fen: str, move_uci: str) -> Dict[str, Any]:
        """Hybrid move analysis"""
        legacy_analysis = self.analyze_move(fen, move_uci)
        ml_analysis = self.analyze_position(fen)

        return {
            **legacy_analysis,
            "ml_evaluation": ml_analysis["evaluation"],
            "ml_embedding": ml_analysis["ml_embedding"],
        }

    # ====================
    # Helper methods
    # ====================

    def _combine_skill_assessments(self, legacy: Dict, ml: Dict) -> Dict:
        """Combine legacy and ML skill assessments"""
        return {
            "level": ml.get("level", legacy.get("level", "unknown")),
            "accuracy": ml.get("accuracy", legacy.get("accuracy_percentage", 0)),
            "weaknesses": list(
                set(legacy.get("weaknesses", []) + ml.get("weak_points", []))
            ),
        }

    def _get_move_explanation(self, board, move):
        """Generate simple explanation for AI moves"""
        # This can be enhanced with more chess knowledge
        if board.is_capture(move):
            return "Capturing your piece to gain material advantage"
        if board.gives_check(move):
            return "Putting your king in check"
        if move.from_square in [
            chess.A2,
            chess.B2,
            chess.C2,
            chess.D2,
            chess.E2,
            chess.F2,
            chess.G2,
            chess.H2,
        ]:
            return "Developing a pawn to control the center"
        return "Improving piece position"

    def _get_move_description(self, move_analysis, move_type):
        descriptions = {
            "best": {
                "opening": "Отличное развитие фигур в дебюте",
                "middlegame": "Сильный тактический удар в миттельшпиле",
                "endgame": "Точная реализация преимущества в эндшпиле",
            },
            "worst": {
                "opening": "Ошибка в дебюте привела к потере темпа",
                "middlegame": "Тактический просчёт в миттельшпиле",
                "endgame": "Неточность в эндшпиле упустила победу",
            },
        }
        return descriptions[move_type][move_analysis["phase"]]

    def _get_move_rank(self, info, move):
        """Determine how good a move is (1=best, 6=worst)"""
        for i, move_info in enumerate(info):
            if move_info["pv"][0] == move:
                return i + 1
        return 6

    def _finalize_analysis(self, move_analyses):
        if not move_analyses:
            return {"error": "Нет ходов для анализа"}

        # Add category weights here
        category_weights = {
            "excellent": 1.0,
            "good": 0.8,
            "ok": 0.6,
            "poor": 0.4,
            "mistake": 0.2,
            "blunder": 0.0,
        }

        skill_profile = self.skill_predictor.assess_skill(move_analyses)
        recommendations = self.learning_path.get_recommendations(skill_profile)

        best_move = max(move_analyses, key=lambda x: category_weights[x["category"]])
        worst_move = min(move_analyses, key=lambda x: category_weights[x["category"]])

        return {
            "skill_profile": skill_profile,
            "recommendations": recommendations,
            "total_moves": len(move_analyses),
            "best_move": {
                "san": best_move["san"],
                "description": self._get_move_description(best_move, "best"),
            },
            "worst_move": {
                "san": worst_move["san"],
                "description": self._get_move_description(worst_move, "worst"),
            },
            "mistakes_count": sum(
                1 for m in move_analyses if m["category"] in ["mistake", "blunder"]
            ),
        }

    def _identify_opening(self, board):
        # Простая идентификация дебюта
        eco_codes = {
            "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR": "Латышский гамбит",
            "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR": "Славянская защита",
        }
        return eco_codes.get(board.fen().split(" ")[0], "Неизвестный дебют")

    def _create_analysis(self, board, move, engine_result):
        """Helper method to create analysis dictionary"""
        return {
            "move": move.uci(),
            "san": board.san(move),
            "category": self._categorize_move(self._get_move_rank(engine_result, move)),
            "piece": str(board.piece_at(move.from_square)).lower(),
            "eval": engine_result[0]["score"].relative.score()
            if not engine_result[0]["score"].is_mate()
            else None,
        }
