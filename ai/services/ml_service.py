import os
from typing import List, Dict
import joblib
import numpy as np
from ml_pipeline.vectorization.chess_vectorizer import ChessVectorizer


class SkillPredictor:
    def __init__(self):
        try:
            base_dir = os.path.dirname(os.path.abspath(__file__))  # path to ml_service/
            model_path = os.path.join(base_dir, "../ml_models/skill_predictor.pkl")
            self.model = joblib.load(model_path)
            self.vectorizer = ChessVectorizer()
            self.levels = ["Beginner", "Intermediate", "Average", "Advanced", "Expert"]
            print(f"✅ SkillPredictor initialized: {type(self.model)}")
        except Exception as e:
            self.model = None
            print("❌ Model load failed, fallback to rule-based:", e)

    def assess_skill(self, move_analyses: List[Dict]) -> Dict:
        if not self.model:
            print("⚠️ No model loaded. Using rule-based fallback.")
            return self._rule_based_assessment(move_analyses)

        try:
            features = self.vectorizer.transform(move_analyses)

            print("📐 Feature vector shape:", features.shape)
            print("🔍 First 10 features:", features[:10])

            if features.shape[0] != 896:
                print(
                    "❌ Feature vector must be of length 896. Got:", features.shape[0]
                )
                return self._rule_based_assessment(move_analyses)

            prediction = self.model.predict([features])[0]
            print("🧠 Predicted level index:", prediction)

            if prediction >= len(self.levels):
                print("❌ Prediction index out of range:", prediction)
                return self._rule_based_assessment(move_analyses)

            skill_level = self.levels[prediction]
            print("✅ Skill level:", skill_level)

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

            piece_stats = {
                f"{piece}_accuracy": round(np.mean(scores) * 100, 1)
                for piece, scores in piece_accuracy.items()
                if scores
            }

            return {
                "piece_accuracy": piece_stats,
                "weaknesses": self._detect_weaknesses(accuracies, piece_stats),
                "level": skill_level,
                "accuracy_percentage": accuracies["overall"],
                "opening_accuracy": accuracies["opening"],
                "middlegame_accuracy": accuracies["middlegame"],
                "endgame_accuracy": accuracies["endgame"],
            }

        except Exception as e:
            print("❌ Exception during ML prediction:", e)
            return self._rule_based_assessment(move_analyses)

    def _move_weight(self, category):
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
        phases = ["opening", "middlegame", "endgame"]
        accuracies = {phase: [] for phase in phases}

        for move in move_analyses:
            phase = move.get("phase", "middlegame")
            if phase in accuracies:
                accuracies[phase].append(self._move_weight(move["category"]))

        results = {}
        for phase in phases:
            results[phase] = (
                round(np.mean(accuracies[phase]) * 100, 1) if accuracies[phase] else 0
            )

        all_weights = [self._move_weight(m["category"]) for m in move_analyses]
        results["overall"] = round(np.mean(all_weights) * 100, 1) if all_weights else 0
        return results

    def _detect_weaknesses(self, accuracies, piece_stats):
        weaknesses = []

        if accuracies["opening"] < 60:
            weaknesses.append("Opening mistakes")
        if accuracies["endgame"] < 50:
            weaknesses.append("Weak endgame")

        piece_names = {
            "pawn": "pawns",
            "knight": "knights",
            "bishop": "bishops",
            "rook": "rooks",
            "queen": "queen",
            "king": "king",
        }

        for piece, acc in piece_stats.items():
            if acc < 55:
                base = piece.split("_")[0]
                if base in piece_names:
                    weaknesses.append(f"Mistakes with {piece_names[base]}")

        return weaknesses

    def _rule_based_assessment(self, move_analyses):
        print("[SkillPredictor] 🔁 Rule-based fallback used")
        return {
            "level": "unknown",
            "accuracy_percentage": 0,
            "weaknesses": [],
            "opening_accuracy": 0,
            "middlegame_accuracy": 0,
            "endgame_accuracy": 0,
            "piece_accuracy": {},
        }
