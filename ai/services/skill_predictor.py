import numpy as np
from typing import List, Dict


class SkillPredictor:
    def assess_skill(self, move_analyses: List[Dict]) -> Dict:
        """Assess player skill based on move analyses"""
        if not move_analyses:
            return {"level": "unknown", "strengths": [], "weaknesses": []}

        lines = [m["line"] for m in move_analyses]
        avg_line = np.mean(lines)

        # Simple skill level mappi
        if avg_line < 1.5:
            level = "expert"
        elif avg_line < 2.5:
            level = "advanced"
        elif avg_line < 3.5:
            level = "intermediate"
        elif avg_line < 4.5:
            level = "beginner"
        else:
            level = "novice"

        # Detect weaknesses
        weaknesses = []
        blunders = [m for m in move_analyses if m["category"] in ["mistake", "blunder"]]
        if blunders:
            common_pieces = np.unique([m["piece"] for m in blunders if m["piece"]])
            weaknesses.extend([f"{p} mistakes" for p in common_pieces])

        return {
            "level": level,
            "average_move_quality": float(avg_line),
            "weaknesses": weaknesses,
            "accuracy_percentage": self._calculate_accuracy(move_analyses),
        }

    def _calculate_accuracy(self, moves):
        good_moves = [m for m in moves if m["category"] in ["excellent", "good"]]
        return round(len(good_moves) / len(moves) * 100, 1) if moves else 0
