import random
from typing import Counter, Dict, List

import numpy as np


class LearningPath:
    def __init__(self, ml_service=None):
        self.ml_service = ml_service

    # In learning_path.py
    def get_recommendations(
        self, skill_profile: Dict, embeddings: list = []
    ) -> List[Dict]:
        recs = []
        weaknesses = skill_profile.get("weaknesses", [])
        mistake_types = Counter(weaknesses)
        top_mistakes = mistake_types.most_common(3)

        # 🔹 Weakness-specific recommendations
        weakness_map = {
            "Opening mistakes": {
                "title": "Study openings",
                "description": "Analyze 3 classical games in your main opening",
                "type": "study",
            },
            "Weak endgame": {
                "title": "Endgame training",
                "description": "Solve 15 endgame puzzles",
                "type": "puzzles",
            },
            "Pawn mistakes": {
                "title": "Pawn structures",
                "description": "Study 5 typical pawn structures",
                "type": "study",
            },
        }

        for weakness, count in top_mistakes:
            if weakness in weakness_map:
                recs.append(
                    {
                        **weakness_map[weakness],
                        "priority": "high" if count >= 3 else "medium",
                        "explanation": f"Detected {count} instance(s) of '{weakness}'",
                    }
                )

        # 🔹 Phase-specific accuracy
        for phase in ["opening", "middlegame", "endgame"]:
            acc = skill_profile.get(f"{phase}_accuracy", 100)
            if acc < 65:
                recs.append(
                    {
                        "title": f"Improve {self._phase_name(phase)}",
                        "description": f"Practice: 20 positions in {self._phase_name(phase, dative=True)}",
                        "type": "practice",
                        "priority": "medium",
                        "explanation": f"Your accuracy in the {phase} is below 65% ({acc}%)",
                    }
                )

        # 🔹 Style-based advice (optional, simulated)
        style = skill_profile.get("style", "balanced")
        if style == "aggressive":
            recs.append(
                {
                    "title": "Control aggression",
                    "description": "Review 10 games where early sacrifices failed",
                    "type": "review",
                    "priority": "medium",
                    "explanation": "You play aggressively; review control strategies",
                }
            )
        elif style == "positional":
            recs.append(
                {
                    "title": "Sharpen tactics",
                    "description": "Solve 20 tactical puzzles to add sharpness",
                    "type": "puzzle",
                    "priority": "high",
                    "explanation": "Your style is positional; improve tactical sharpness",
                }
            )

        # 🔹 ML recommendations
        if embeddings and self.ml_service:
            recs.extend(self._get_ml_recommendations(embeddings))

        return self._deduplicate_recommendations(recs)

    def _deduplicate_recommendations(self, recs: List[Dict]) -> List[Dict]:
        seen = set()
        unique_recs = []
        for rec in recs:
            key = (rec["title"], rec["type"])
            if key not in seen:
                seen.add(key)
                unique_recs.append(rec)
        return unique_recs

    def _phase_name(self, phase, dative=False):
        names = {
            "opening": ("opening", "opening"),
            "middlegame": ("middlegame", "middlegame"),
            "endgame": ("endgame", "endgame"),
        }
        return names.get(phase, [phase, phase])[1 if dative else 0]

    def _get_ml_weaknesses(self, embeddings):
        """Get weaknesses from ML model"""
        # This would come from a dedicated ML model
        # For now, we'll simulate based on common patterns
        return ["Tactical mistakes", "Positional understanding"]

    def _get_ml_recommendations(self, embeddings):
        """Generate ML-powered recommendations"""
        # This would come from a recommendation model
        return [
            {
                "title": "Personalized training",
                "description": "Custom program based on your playing style",
                "type": "custom",
                "priority": "high",
            }
        ]
