import io
import chess
import chess.engine
import chess.pgn 
import numpy as np
from typing import Dict, Any, List
from .feedback_generator import FeedbackGenerator
from .skill_predictor import SkillPredictor
from .learning_path import LearningPath



class ChessAIService:
    def __init__(self, engine_path: str = "/opt/homebrew/bin/stockfish"):
        self.engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        self.feedback_gen = FeedbackGenerator()
        self.skill_predictor = SkillPredictor()
        self.learning_path = LearningPath()
        self.player_history = []

    def analyze_move(self, fen: str, move_uci: str) -> Dict[str, Any]:
        """Enhanced move analysis with personalized feedback"""
        board = chess.Board(fen)
        move = chess.Move.from_uci(move_uci)

        # Get Stockfish analysis
        info = self.engine.analyse(
            board,
            chess.engine.Limit(depth=18),  # Increased depth
            multipv=5
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
        }

        # Store for skill assessment
        self.player_history.append(analysis)

        # Get personalized feedback
        feedback = self.feedback_gen.get_feedback(analysis, self.player_history)
        analysis.update(feedback)

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
    def analyze_game(self, moves: List[str]) -> Dict[str, Any]:
      """Comprehensive game analysis with skill assessment"""
      try:
        if not moves:
            return {"error": "No moves provided"}
            
        board = chess.Board()
        move_analyses = []

        for move_uci in moves:
            try:
                move = chess.Move.from_uci(move_uci)
                if move not in board.legal_moves:
                    continue
                    
                analysis = self.analyze_move(board.fen(), move_uci)
                move_analyses.append(analysis)
                board.push(move)
            except Exception as e:
                print(f"Error analyzing move {move_uci}: {str(e)}")
                continue

        if not move_analyses:
            return {"error": "No valid moves to analyze"}

        # Skill assessment
        skill_profile = self.skill_predictor.assess_skill(move_analyses)

        # Learning recommendations
        recommendations = self.learning_path.get_recommendations(skill_profile)

        return {
            "skill_profile": skill_profile,
            "recommendations": recommendations,
            "move_analyses": move_analyses,
        }
      except Exception as e:
        print(f"Error in analyze_game: {str(e)}")
        return {"error": "Internal server error during analysis"}
      
    def _create_analysis(self, board, move, engine_result):
      """Helper method to create analysis dictionary"""
      return {
        "move": move.uci(),
        "san": board.san(move),
        "category": self._categorize_move(self._get_move_rank(engine_result, move)),
        "piece": str(board.piece_at(move.from_square)).lower(),
        "eval": engine_result[0]["score"].relative.score() 
                if not engine_result[0]["score"].is_mate() else None
    }

    def _finalize_analysis(self, move_analyses):
      """Final processing of analysis results"""
      if not move_analyses:
        return {"error": "No moves analyzed"}
    
      skill_profile = self.skill_predictor.assess_skill(move_analyses)
      recommendations = self.learning_path.get_recommendations(skill_profile)
    
      return {
        "skill_profile": skill_profile,
        "recommendations": recommendations,
        "move_analyses": move_analyses,
        "total_moves": len(move_analyses)
    }

    def analyze_pgn(self, pgn: str, player_color: str = "white") -> Dict[str, Any]:
      try:
        game = chess.pgn.read_game(io.StringIO(pgn))
        if not game:
            return {"error": "Could not parse PGN"}

        board = game.board()
        move_analyses = []
        
        for i, move in enumerate(game.mainline_moves()):
            try:
                # Adaptive depth based on game phase
                depth = 14 if i < 20 else (12 if i < 40 else 10)
                
                info = self.engine.analyse(
                    board,
                    chess.engine.Limit(depth=depth),
                    multipv=3
                )
                
                analysis = self._create_analysis(board, move, info)
                move_analyses.append(analysis)
                board.push(move)
                
                # Progress logging
                if (i+1) % 10 == 0:
                    print(f"Analyzed {i+1} moves")
                    
            except Exception as e:
                print(f"Error analyzing move {i+1}: {str(e)}")
                continue

        return self._finalize_analysis(move_analyses)
        
      except Exception as e:
        print(f"Error in analyze_pgn: {str(e)}")
        return {"error": str(e)}

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
                board,
                chess.engine.Limit(depth=depth),
                multipv=2
            )
            
            analysis = self._create_analysis(board, move, result)
            analyses.append(analysis)
            board.push(move)
            
            # Report progress
            if callback:
                callback({
                    'current': i+1,
                    'total': len(list(game.mainline_moves())),
                    'fen': board.fen()
                })
                
        except Exception as e:
            print(f"Move {i+1} error: {str(e)}")
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
