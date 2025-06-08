import random
from typing import Dict, List

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

        # Weakness-specific recommendations
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
            # Add more mappings
        }

        for weakness in weaknesses:
            if weakness in weakness_map:
                recs.append(
                    {
                        **weakness_map[weakness],
                        "priority": "high"
                        if "mistakes" in weakness.lower()
                        else "medium",
                    }
                )

        # Add phase-specific recommendations
        for phase in ["opening", "middlegame", "endgame"]:
            acc = skill_profile.get(f"{phase}_accuracy", 100)
            if acc < 65:
                recs.append(
                    {
                        "title": f"Improve {self._phase_name(phase)}",
                        "description": f"Practice: 20 positions in {self._phase_name(phase, dative=True)}",
                        "type": "practice",
                        "priority": "medium",
                    }
                )

        # Add personalized recommendations if available
        if embeddings and self.ml_service:
            recs.extend(self._get_ml_recommendations(embeddings))

        return recs

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
