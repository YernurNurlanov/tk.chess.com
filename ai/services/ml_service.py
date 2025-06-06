from typing import List, Dict
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from ml_pipeline.vectorization.chess_vectorizer import ChessVectorizer


class SkillPredictor:
    def __init__(self):
        # Load pre-trained model
        try:
            self.model = joblib.load("ml_models/skill_predictor.pkl")
            self.vectorizer = ChessVectorizer()
            self.levels = ["Новичок", "Начинающий", "Средний", "Продвинутый", "Эксперт"]
        except:
            self.model = None
            print("Skill level model not found, using fallback method")

    def assess_skill(self, move_analyses: List[Dict]) -> Dict:
        # Use ML model if available
        if self.model:
            # Create feature vector from move analyses
            features = self._create_feature_vector(move_analyses)
            prediction = self.model.predict([features])[0]
            skill_level = self.levels[prediction]

            # Calculate accuracy percentages for reporting
            accuracies = self._calculate_accuracies(move_analyses)

            piece_accuracy = {
                "pawn": [],
                "knight": [],
                "bishop": [],
                "rook": [],
                "queen": [],
                "king": [],
            }

            for move in move_analyses:
                piece_type = move.get("piece", "").lower()
                if piece_type in piece_accuracy:
                    weight = self._move_weight(move["category"])
                    piece_accuracy[piece_type].append(weight)

            # Calculate piece-specific accuracies
            piece_stats = {}
            for piece, scores in piece_accuracy.items():
                if scores:
                    piece_stats[f"{piece}_accuracy"] = round(np.mean(scores) * 100, 1)

            return {
                "piece_accuracy": piece_stats,
                "weaknesses": self._detect_weaknesses(accuracies, piece_stats),
                "level": skill_level,
                "accuracy_percentage": accuracies["overall"],
                # "weaknesses": self._detect_weaknesses(accuracies),
                "opening_accuracy": accuracies["opening"],
                "middlegame_accuracy": accuracies["middlegame"],
                "endgame_accuracy": accuracies["endgame"],
            }
        else:
            # Fallback to rule-based method
            return self._rule_based_assessment(move_analyses)

    def _create_feature_vector(self, move_analyses):
        """Create feature vector from move analyses"""
        features = []

        # Accuracy by phase
        for phase in ["opening", "middlegame", "endgame"]:
            phase_moves = [m for m in move_analyses if m.get("phase") == phase]
            if phase_moves:
                accuracy = np.mean(
                    [self._move_weight(m["category"]) for m in phase_moves]
                )
                features.append(accuracy)
            else:
                features.append(0)

        # Add additional features
        features.append(len(move_analyses))  # total moves
        features.append(
            sum(1 for m in move_analyses if m["category"] in ["mistake", "blunder"])
        )  # mistakes

        return features

    def _move_weight(self, category):
        """Weight for move categories"""
        weights = {
            "excellent": 1.0,
            "good": 0.8,
            "ok": 0.6,
            "poor": 0.4,
            "mistake": 0.2,
            "blunder": 0.0,
        }
        return weights.get(category, 0.5)

    def _calculate_accuracies(self, move_analyses):
        """Calculate accuracy percentages for reporting"""
        phases = ["opening", "middlegame", "endgame"]
        accuracies = {phase: [] for phase in phases}

        for move in move_analyses:
            phase = move.get("phase", "middlegame")
            if phase in accuracies:
                accuracies[phase].append(self._move_weight(move["category"]))

        results = {}
        for phase in phases:
            if accuracies[phase]:
                results[phase] = round(np.mean(accuracies[phase]) * 100, 1)
            else:
                results[phase] = 0

        all_weights = [self._move_weight(m["category"]) for m in move_analyses]
        results["overall"] = round(np.mean(all_weights) * 100, 1) if all_weights else 0

        return results

    def _detect_weaknesses(self, accuracies, piece_stats):
        """More nuanced weakness detection"""
        weaknesses = []

        if accuracies["opening"] < 60:
            weaknesses.append("Дебютные ошибки")

        if accuracies["endgame"] < 50:
            weaknesses.append("Слабый эндшпиль")

        # Piece-specific weaknesses
        for piece, acc in piece_stats.items():
            if acc < 55:
                piece_name = {
                    "pawn": "пешками",
                    "knight": "конями",
                    "bishop": "слонами",
                    "rook": "ладьями",
                    "queen": "ферзём",
                    "king": "королём",
                }.get(piece.split("_")[0], "")
                weaknesses.append(f"Ошибки с {piece_name}")

        return weaknesses

    def _rule_based_assessment(self, move_analyses):
        print("[SkillPredictor] Rule-based fallback triggered")
        return {
            "level": "unknown",
            "accuracy_percentage": 0,
            "weaknesses": [],
            "opening_accuracy": 0,
            "middlegame_accuracy": 0,
            "endgame_accuracy": 0,
            "piece_accuracy": {},
        }
