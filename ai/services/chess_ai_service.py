import io
import re
import chess
import chess.engine
import chess.pgn
import numpy as np
import random
from typing import Counter, Dict, Any, List
from .learning_path import LearningPath
from .feedback_service import FeedbackService as FeedbackGenerator
from .ml_service import SkillPredictor


class ChessAIService:
    def __init__(
        self,
        engine_path: str = "/opt/homebrew/bin/stockfish",
        use_ml_feedback: bool = True,
    ):
        self.engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        self.feedback_gen = FeedbackGenerator()
        # self.feedback_service = FeedbackService()
        self.skill_predictor = SkillPredictor()
        self.learning_path = LearningPath()
        self.player_history = []
        self.use_ml_feedback = use_ml_feedback

    def analyze_move(self, fen: str, move_uci: str) -> Dict[str, Any]:
        board = chess.Board(fen)
        move = chess.Move.from_uci(move_uci)

        # Get Stockfish analysis
        info = self.engine.analyse(
            board,
            chess.engine.Limit(depth=18),
            multipv=5,
        )

        # Determine move quality
        player_move_line = self._get_move_rank(info, move)
        piece = board.piece_at(move.from_square)

        # Generate feedback
        analysis = {
            "line": player_move_line,
            "piece": str(piece).lower() if piece else None,
            "san_move": board.san(move),
            "category": self._categorize_move(player_move_line),
            "top_suggestion": info[0]["pv"][0].uci() if info else None,
            "fen": fen,
            "move": move_uci,
        }

        # Store for skill assessment
        self.player_history.append(analysis)

        # Get personalized feedback
        feedback = self.feedback_gen.get_feedback(analysis, self.player_history)
        analysis.update(feedback)

        # Add ML-powered feedback if enabled
        if self.use_ml_feedback:
            try:
                ml_feedback = self.feedback_service.generate_feedback(
                    analysis, self.player_history
                )
                analysis["ml_feedback"] = ml_feedback
            except Exception as e:
                print(f"ML feedback error: {e}")
                analysis["ml_feedback"] = "ML analysis unavailable"

        return analysis

    def generate_move(self, fen: str, skill_level: int = 3) -> Dict[str, Any]:
        """Generate AI move with adaptive skill"""
        board = chess.Board(fen)
        info = self.engine.analyse(board, chess.engine.Limit(time=0.1), multipv=6)

        # Adjust skill level based on player history if available
        if self.player_history:
            avg_level = np.mean([m["line"] for m in self.player_history[-5:]])
            skill_level = min(max(int(round(avg_level)), 1), 6)

        selected_index = min(skill_level - 1, len(info) - 1)
        selected_move = info[selected_index]["pv"][0]

        return {
            "move": selected_move.uci(),
            "skill_level": skill_level,
            "explanation": self._get_move_explanation(board, selected_move),
        }

    def _create_analysis(self, board, move, engine_result):
        """Helper method to create analysis dictionary"""
        phase = self._determine_game_phase(board)
        return {
            "move": move.uci(),
            "san": board.san(move),
            "phase": phase,
            "category": self._categorize_move(self._get_move_rank(engine_result, move)),
            "piece": str(board.piece_at(move.from_square)).lower(),
            "eval": engine_result[0]["score"].relative.score()
            if not engine_result[0]["score"].is_mate()
            else None,
        }

    def _identify_opening(self, moves):
        """Comprehensive opening detection with English Opening support"""
        if not moves or len(moves) < 2:
            return "Неизвестный дебют"

        move_sequence = [m.uci() for m in moves[:6]]  # First 6 moves

        print("\n==== OPENING DETECTION =====")
        print("Move sequence:", move_sequence)

        # ===== English Opening (c4) =====
        if move_sequence[0] == "c2c4":
            # Symmetrical Variation
            if move_sequence[1] == "c7c5":
                return "Английское начало (Симметричный вариант)"
            # Reversed Sicilian
            if move_sequence[1] == "e7e5":
                return "Английское начало (Обратная Сицилианская)"
            # Standard
            return "Английское начало"

        # ===== Queen's Gambit (d4 d5 c4) =====
        if (
            len(move_sequence) >= 3
            and move_sequence[0] == "d2d4"
            and move_sequence[1] == "d7d5"
            and move_sequence[2] == "c2c4"
        ):
            # Slav Defense
            if len(move_sequence) > 3 and move_sequence[3] == "c7c6":
                return "Славянская защита"
            # Orthodox
            return "Ферзевый гамбит"

        # ===== King's Pawn Openings =====
        if move_sequence[0] == "e2e4":
            if move_sequence[1] == "e7e5":
                return "Открытая партия"
            if move_sequence[1] == "c7c5":
                return "Сицилианская защита"
            if move_sequence[1] == "e7e6":
                return "Французская защита"
            if move_sequence[1] == "d7d6":
                return "Защита Пирца"

        # ===== Other openings =====
        if move_sequence[0] == "d2d4" and move_sequence[1] == "g8f6":
            return "Индийская защита"
        if move_sequence[0] == "g1f3":
            return "Дебют Рети"
        if move_sequence[0] == "f2f4":
            return "Дебют Берда"

        print("No known opening pattern matched")
        return "Неизвестный дебют"

    def _determine_game_phase(self, board):
        """Robust game phase detection with move number consideration"""
        # Always opening for first 10 full moves
        if board.fullmove_number <= 10:
            return "opening"

        # Count material
        queens = len(board.pieces(chess.QUEEN, chess.WHITE)) + len(
            board.pieces(chess.QUEEN, chess.BLACK)
        )
        minors = (
            len(board.pieces(chess.BISHOP, chess.WHITE))
            + len(board.pieces(chess.KNIGHT, chess.WHITE))
            + len(board.pieces(chess.BISHOP, chess.BLACK))
            + len(board.pieces(chess.KNIGHT, chess.BLACK))
        )
        pawns = len(board.pieces(chess.PAWN, chess.WHITE)) + len(
            board.pieces(chess.PAWN, chess.BLACK)
        )
        rooks = len(board.pieces(chess.ROOK, chess.WHITE)) + len(
            board.pieces(chess.ROOK, chess.BLACK)
        )

        # Endgame detection
        if queens == 0 or (queens <= 1 and pawns <= 6 and minors + rooks <= 4):
            return "endgame"

        # Middlegame by default
        return "middlegame"

    def analyze_pgn(self, pgn: str) -> Dict[str, Any]:
        try:
            print("\n===== ANALYZING PGN =====")
            print("Raw PGN received:")
            print(pgn)

            # Create a clean PGN by removing result markers and special characters
            clean_pgn = re.sub(r"\s*\*\s*$", "", pgn)  # Remove trailing *
            clean_pgn = re.sub(r"\s*\.\.\.\s*", " ", clean_pgn)  # Remove ellipsis
            clean_pgn = re.sub(r"\d+\.\s*", "", clean_pgn)  # Remove move numbers
            clean_pgn = re.sub(r"\s+", " ", clean_pgn).strip()  # Normalize whitespace

            print("Cleaned PGN moves:", clean_pgn)

            game = chess.pgn.read_game(io.StringIO(pgn))
            if not game:
                print("Failed to parse PGN, trying fallback method")
                return self._fallback_pgn_analysis(clean_pgn)

            board = game.board()
            print("Initial position:", board.fen())

            # Extract all moves in SAN notation
            san_moves = []
            node = game
            while node.variations:
                next_node = node.variation(0)
                san_moves.append(node.board().san(next_node.move))
                node = next_node

            print("SAN moves extracted:", san_moves)
            return self._analyze_move_sequence(san_moves)

        except Exception as e:
            print(f"Error in analyze_pgn: {str(e)}")
            return {"error": str(e)}

    def _fallback_pgn_analysis(self, move_string: str) -> Dict[str, Any]:
        """Fallback when PGN parsing fails"""
        print("Using fallback PGN analysis")
        try:
            # Split moves and convert to UCI
            moves = []
            board = chess.Board()
            for san in move_string.split():
                try:
                    move = board.parse_san(san)
                    moves.append(move.uci())
                    board.push(move)
                except:
                    # Skip invalid moves
                    continue

            print("Fallback UCI moves:", moves)
            return self.analyze_game(moves)

        except Exception as e:
            print(f"Fallback analysis failed: {str(e)}")
            return {"error": "Could not analyze PGN"}

    def _analyze_move_sequence(self, san_moves: List[str]) -> Dict[str, Any]:
        """Analyze game from SAN move sequence"""
        board = chess.Board()
        move_analyses = []

        for i, san_move in enumerate(san_moves):
            try:
                move = board.parse_san(san_move)
                analysis = self.analyze_move(board.fen(), move.uci())
                move_analyses.append(analysis)
                board.push(move)
            except Exception as e:
                print(f"Error analyzing move {i + 1} ({san_move}): {str(e)}")
                continue

        if not move_analyses:
            return {"error": "No valid moves to analyze"}

        # Skill assessment
        skill_profile = self.skill_predictor.assess_skill(move_analyses)

        # Get opening from first few moves
        opening = self._identify_opening(
            [board.move_stack[i] for i in range(min(6, len(board.move_stack)))]
        )

        return {
            "skill_profile": skill_profile,
            "opening": opening,
            "move_analyses": move_analyses,
        }

    def _finalize_analysis(self, move_analyses, embeddings=[]):
        if not move_analyses:
            return {"error": "Нет ходов для анализа"}

        category_weights = {
            "excellent": 1.0,
            "good": 0.8,
            "ok": 0.6,
            "poor": 0.4,
            "mistake": 0.2,
            "blunder": 0.0,
        }

        skill_profile = self.skill_predictor.assess_skill(move_analyses)
        recommendations = self.learning_path.get_recommendations(
            skill_profile, embeddings
        )

        best_move = max(move_analyses, key=lambda x: category_weights[x["category"]])
        worst_move = min(move_analyses, key=lambda x: category_weights[x["category"]])

        return {
            "skill_profile": skill_profile,
            "recommendations": recommendations,
            "total_moves": len(move_analyses),
            "best_move": {
                "san": best_move["san"],
                "phase": best_move["phase"],
                "description": self._get_move_description(best_move, "best"),
            },
            "worst_move": {
                "san": worst_move["san"],
                "phase": worst_move["phase"],
                "description": self._get_move_description(worst_move, "worst"),
            },
            "mistakes_count": sum(
                1 for m in move_analyses if m["category"] in ["mistake", "blunder"]
            ),
        }

    def _get_move_description(self, move_analysis, move_type):
        phase = move_analysis.get("phase", "middlegame")

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

        return descriptions[move_type].get(phase, "Важный ход в игре")

    def _get_move_rank(self, info, move):
        """Determine how good a move is (1=best, 6=worst)"""
        for i, move_info in enumerate(info):
            if move_info["pv"][0] == move:
                return i + 1
        return 6

    def progressive_analyze(self, pgn: str, callback=None):
        """Analyze with progress reporting"""
        game = chess.pgn.read_game(io.StringIO(pgn))
        board = game.board()
        analyses = []

        for i, move in enumerate(game.mainline_moves()):
            try:
                # Adjust depth based on game phase
                depth = 16 if i < 15 else 14  # Deeper for opening/middlegame

                result = self.engine.analyse(
                    board, chess.engine.Limit(depth=depth), multipv=2
                )

                analysis = self._create_analysis(board, move, result)
                analyses.append(analysis)
                board.push(move)

                # Report progress
                if callback:
                    callback(
                        {
                            "current": i + 1,
                            "total": len(list(game.mainline_moves())),
                            "fen": board.fen(),
                        }
                    )

            except Exception as e:
                print(f"Move {i + 1} error: {str(e)}")
                continue

        return self._finalize_analysis(analyses)

    def _categorize_move(self, line):
        # More realistic categorization
        if line == 1:
            return "excellent"
        elif line <= 3:
            return "good"
        elif line <= 5:
            return "ok"
        elif line <= 8:
            return "poor"
        elif line <= 12:
            return "mistake"
        else:
            return "blunder"

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
