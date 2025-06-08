from typing import Dict, List


class FeedbackGenerator:
    def get_feedback(self, move_analysis: Dict, history: List[Dict]) -> Dict:
        return {
            "strength": self._get_strength(move_analysis),
            "suggestion": self._get_suggestion(move_analysis),
            "pattern_feedback": self._detect_patterns(history),
        }

    def _get_strength(self, move):
        descriptions = {
            "excellent": "Excellent move! The best possible option",
            "good": "Good move! One of the best options",
            "ok": "Acceptable move, but there are better options",
            "poor": "Inaccuracy. Consider other options",
            "mistake": "Mistake! Worsens your position",
            "blunder": "Blunder! Could lead to defeat",
        }
        return descriptions.get(move["category"], "Move analysis")

    def _get_suggestion(self, move):
        suggestions = {
            "excellent": "Keep up the good work!",
            "good": "Good choice, continue!",
            "ok": f"Consider {move['top_suggestion']} to improve your position",
            "poor": f"Better was {move['top_suggestion']} to maintain advantage",
            "mistake": f"Recommended {move['top_suggestion']} to correct the position",
            "blunder": f"Urgently need {move['top_suggestion']} for defense",
        }
        return suggestions.get(move["category"], "Recommendation analysis")

    def _detect_patterns(self, history):
        patterns = []
        if len([m for m in history if m["piece"] == "p"]) > 3:
            patterns.append("Frequent pawn structure mistakes")
        if len([m for m in history if m["piece"] == "k"]) > 2:
            patterns.append("Weak king control of the center")
        return patterns if patterns else ["Stable play, keep it up!"]
