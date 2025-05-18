from typing import List, Dict
import numpy as np
from collections import defaultdict

# Define cognitive skills explicitly for research tracking
ALL_SKILLS = [
    "pattern_recognition",
    "calculation",
    "positional_understanding",
    "tactical_vision",
    "endgame_technique",
    "opening_principles",
    "time_management",
    "piece_coordination",
]


class LearningTracker:
    def __init__(self):
        self.skill_vectors = defaultdict(list)
        self.improvement_rates = defaultdict(dict)

    def track_improvement(self, user_id: str, feedback_sequence: List[Dict]) -> Dict:
        """
        Measure progress across cognitive dimensions

        Args:
            user_id: Unique identifier for the learner
            feedback_sequence: List of feedback dictionaries from LLMFeedbackGenerator

        Returns:
            Dictionary with improvement metrics for each skill
        """
        if not feedback_sequence:
            return {}

        # Create skill vectors for trend analysis
        for feedback in feedback_sequence:
            vector = [
                1 if skill in feedback.get("cognitive_analysis", "") else 0
                for skill in ALL_SKILLS
            ]
            self.skill_vectors[user_id].append(vector)

        # Calculate improvement rates
        if len(self.skill_vectors[user_id]) > 5:  # Minimum for trend analysis
            recent = np.mean(self.skill_vectors[user_id][-5:], axis=0)
            older = np.mean(self.skill_vectors[user_id][:-5], axis=0)
            self.improvement_rates[user_id] = {
                skill: recent[i] - older[i] for i, skill in enumerate(ALL_SKILLS)
            }

        return self.improvement_rates.get(user_id, {})

    def get_skill_distribution(self, user_id: str) -> Dict:
        """
        Get current skill focus distribution

        Args:
            user_id: Learner identifier

        Returns:
            Dictionary with percentage focus for each skill
        """
        if not self.skill_vectors.get(user_id):
            return {}

        current = np.mean(self.skill_vectors[user_id][-3:], axis=0)  # Last 3 moves
        total = sum(current)
        return {
            skill: round(100 * current[i] / total, 1) if total > 0 else 0
            for i, skill in enumerate(ALL_SKILLS)
        }
