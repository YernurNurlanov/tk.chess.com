from typing import Dict, List


class LearningPath:
    def get_recommendations(self, skill_profile: Dict) -> List[Dict]:
        """Generate personalized learning recommendations"""
        level = skill_profile.get("level", "beginner")
        weaknesses = skill_profile.get("weaknesses", [])

        recommendations = []

        # Level-based recommendations
        if level in ["novice", "beginner"]:
            recommendations.append(
                {
                    "type": "lesson",
                    "topic": "Basic Rules and Piece Movement",
                    "priority": "high",
                }
            )

        # Weakness-specific recommendations
        for weakness in weaknesses:
            if "pawn" in weakness:
                recommendations.append(
                    {
                        "type": "lesson",
                        "topic": "Pawn Structures and Strategy",
                        "priority": "medium",
                    }
                )
            if "knight" in weakness:
                recommendations.append(
                    {
                        "type": "exercise",
                        "topic": "Knight Outposts",
                        "priority": "medium",
                    }
                )

        # Add practice games recommendation
        recommendations.append(
            {"type": "practice", "format": "10-min games", "priority": "low"}
        )

        return recommendations
