from typing import List, Dict


class FeedbackGenerator:
    def get_feedback(self, move_analysis: Dict, history: List[Dict]) -> Dict:
        """Generate personalized feedback based on move and history"""
        feedback = {
            "strength": self._get_strength_description(move_analysis),
            "suggestion": self._get_suggestion(move_analysis),
            "pattern_feedback": self._detect_patterns(history),
        }
        return feedback

    def _get_strength_description(self, move):
        descriptions = {
            "excellent": "Perfect move! You found the best option.",
            "good": "Good move! Among the top choices.",
            "ok": "Reasonable move, but there were better options.",
            "poor": "Inaccurate move. Consider alternatives next time.",
            "mistake": "Mistake. This weakens your position.",
            "blunder": "Blunder! This could cost you the game.",
        }
        return descriptions.get(move["category"], "Move analyzed.")

    def _get_suggestion(self, move):
        if move["category"] in ["excellent", "good"]:
            return "Keep up the good work!"
        return f"Consider {move['top_suggestion']} next time for better results."

    def _detect_patterns(self, history):
        """Identify recurring weaknesses"""
        if len(history) < 5:
            return "Keep playing for more personalized feedback"

        recent_moves = history[-5:]
        blunders = [m for m in recent_moves if m["category"] in ["mistake", "blunder"]]

        patterns = []
        if len(blunders) > 2:
            piece_types = [m["piece"] for m in blunders if m["piece"]]
            if "p" in piece_types:
                patterns.append("You're making several pawn structure mistakes")
            if "n" in piece_types:
                patterns.append("Your knight placements need improvement")

        return patterns if patterns else "No major patterns detected yet"
