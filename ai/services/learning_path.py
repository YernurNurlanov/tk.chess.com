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
            "Дебютные ошибки": {
                "title": "Изучение дебютов",
                "description": "Разберите 3 классические партии в вашем основном дебюте",
                "type": "study",
            },
            "Слабый эндшпиль": {
                "title": "Тренировка эндшпиля",
                "description": "Решите 15 задач по эндшпилю",
                "type": "puzzles",
            },
            "Ошибки с пешками": {
                "title": "Пешечные структуры",
                "description": "Изучите 5 типичных пешечных структур",
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
                        if "ошибки" in weakness.lower()
                        else "medium",
                    }
                )

        # Add phase-specific recommendations
        for phase in ["opening", "middlegame", "endgame"]:
            acc = skill_profile.get(f"{phase}_accuracy", 100)
            if acc < 65:
                recs.append(
                    {
                        "title": f"Улучшение {self._phase_name(phase)}",
                        "description": f"Практика: 20 позиций в {self._phase_name(phase, dative=True)}",
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
            "opening": ("дебют", "дебюте"),
            "middlegame": ("миттельшпиль", "миттельшпиле"),
            "endgame": ("эндшпиль", "эндшпиле"),
        }
        return names.get(phase, [phase, phase])[1 if dative else 0]

    def _get_ml_weaknesses(self, embeddings):
        """Get weaknesses from ML model"""
        # This would come from a dedicated ML model
        # For now, we'll simulate based on common patterns
        return ["Тактические ошибки", "Позиционное понимание"]

    def _get_ml_recommendations(self, embeddings):
        """Generate ML-powered recommendations"""
        # This would come from a recommendation model
        return [
            {
                "title": "Персонализированная тренировка",
                "description": "Специальная программа на основе вашего стиля игры",
                "type": "custom",
                "priority": "high",
            }
        ]
