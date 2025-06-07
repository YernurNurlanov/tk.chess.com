import io
import re
import traceback
import chess
import chess.engine
import chess.pgn
import numpy as np
import random
from typing import Counter, Dict, Any, List
from .learning_path import LearningPath
from .feedback_generator import FeedbackGenerator
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
            chess.engine.Limit(depth=10),
            multipv=5,
        )

        # Determine move quality
        player_move_line = self._get_move_rank(info, move)
        piece = board.piece_at(move.from_square)

        # Detect phase of the game
        phase = self._determine_game_phase(board)

        # Generate feedback object
        analysis = {
            "line": player_move_line,
            "piece": str(piece).lower() if piece else None,
            "san_move": board.san(move),
            "category": self._categorize_move(player_move_line),
            "top_suggestion": info[0]["pv"][0].uci() if info else None,
            "fen": fen,
            "move": move_uci,
            "phase": phase,  # ✅ this is the key fix
        }

        # Store for history
        self.player_history.append(analysis)

        # Rule-based feedback
        feedback = self.feedback_gen.get_feedback(analysis, self.player_history)
        analysis.update(feedback)

        # ML-powered feedback
        if self.use_ml_feedback:
            try:
                ml_feedback = self.feedback_gen.get_feedback(
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

    def _identify_opening(self, san_moves: List[str]) -> str:
        """Identify opening using SAN move patterns (cleaned strings)"""
        if not san_moves or len(san_moves) < 2:
            return "Неизвестный дебют"

        print("\n==== OPENING DETECTION =====")
        print("SAN sequence:", san_moves[:6])

        # Normalize first moves: remove captures, promotions, check/mate, uppercase
        normalized = [
            re.sub(r"[+#=NBRQKx]", "", move).lower() for move in san_moves[:6]
        ]
        print("Normalized:", normalized)

        if normalized[0] == "e4":
            if len(normalized) > 1 and normalized[1] == "e5":
                return "Открытая партия"
            elif normalized[1] == "c5":
                return "Сицилианская защита"
            elif normalized[1] == "e6":
                return "Французская защита"
            elif normalized[1] == "d6":
                return "Защита Пирца"

        if normalized[0] == "d4":
            if len(normalized) > 1 and normalized[1] == "d5":
                if len(normalized) > 2 and normalized[2] == "c4":
                    return "Ферзевый гамбит"
            elif normalized[1] == "nf6":
                return "Индийская защита"

        if normalized[0] == "c4":
            return "Английское начало"
        if normalized[0] == "f4":
            return "Дебют Берда"
        if normalized[0] == "nf3":
            return "Дебют Рети"

        return "Неизвестный дебют"

    def _determine_game_phase(self, board):
        """Robust game phase detections with move number consideration"""
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

    def analyze_pgn(self, pgn: str, player_color: str = "white") -> Dict[str, Any]:
        try:
            game = chess.pgn.read_game(io.StringIO(pgn))
            if not game:
                return self._fallback_pgn_analysis(pgn)

            board = game.board()
            san_moves = []
            node = game
            while node.variations:
                next_node = node.variation(0)
                san_moves.append(node.board().san(next_node.move))
                node = next_node

            move_analyses = self._analyze_move_sequence(san_moves)
            opening_name = self._identify_opening(san_moves)

            final_result = self._finalize_analysis(move_analyses)
            final_result["opening"] = opening_name
            final_result["move_analyses"] = move_analyses
            return final_result

        except Exception as e:
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
            return self._analyze_move_sequence_from_uci(moves)

        except Exception as e:
            print(f"Fallback analysis failed: {str(e)}")
            return {"error": "Could not analyze PGN"}

    def _analyze_move_sequence_from_uci(self, uci_moves: List[str]) -> Dict[str, Any]:
        board = chess.Board()
        move_analyses = []

        for uci in uci_moves:
            try:
                move = chess.Move.from_uci(uci)
                analysis = self.analyze_move(board.fen(), move.uci())
                move_analyses.append(analysis)
                board.push(move)
            except Exception as e:
                print(f"Error analyzing move {uci}: {str(e)}")
                continue

        if not move_analyses:
            return {"error": "No valid moves to analyze"}

        result = self._finalize_analysis(move_analyses)
        result["skill_profile"] = self.skill_predictor.assess_skill(move_analyses)
        result["opening"] = self._identify_opening(
            self._get_san_moves_from_stack(board, limit=6)
        )
        return result

    def _analyze_move_sequence(self, san_moves: List[str]) -> List[Dict[str, Any]]:
        board = chess.Board()
        move_analyses = []

        for i, san_move in enumerate(san_moves):
            try:
                move = board.parse_san(san_move)
                analysis = self.analyze_move(board.fen(), move.uci())
                move_analyses.append(analysis)
                board.push(move)
            except Exception as e:
                print(f"Ошибка анализа хода {i + 1}: {san_move} — {e}")
                continue

        return move_analyses

    def _get_san_moves_from_stack(self, board: chess.Board, limit=6) -> List[str]:
        temp_board = chess.Board()
        san_moves = []
        for move in board.move_stack[:limit]:
            try:
                san = temp_board.san(move)
                san_moves.append(san)
                temp_board.push(move)
            except Exception as e:
                print(f"Ошибка при генерации SAN: {move} — {e}")
                break
        return san_moves

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
                "san": best_move.get("san")
                or best_move.get("san_move")
                or best_move["move"],
                "phase": best_move["phase"],
                "description": self._get_move_description(best_move, "best"),
            },
            "worst_move": {
                "san": worst_move.get("san")
                or worst_move.get("san_move")
                or worst_move["move"],
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
