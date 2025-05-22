
from typing import Dict, List
class LearningPath:
    def get_recommendations(self, skill_profile: Dict) -> List[Dict]:
        recommendations = []
        weaknesses = skill_profile.get("weaknesses", [])
        level = skill_profile.get("level", "beginner")

        # Weakness-based recommendations
        if "Critical blunders" in weaknesses:
            recommendations.append({
                "type": "training",
                "format": "Endgame practice",
                "priority": "high"
            })
            
        if "Frequent mistakes" in weaknesses:
            recommendations.append({
                "type": "study",
                "format": "Tactical puzzles",
                "priority": "medium"
            })

        # Level-based defaults
        if not recommendations:
            if level in ["novice", "beginner"]:
                recommendations.append({
                    "type": "lesson",
                    "format": "Basic Strategy",
                    "priority": "medium"
                })
            else:
                recommendations.append({
                    "type": "practice",
                    "format": "Analyze classic games",
                    "priority": "low"
                })

        return recommendations