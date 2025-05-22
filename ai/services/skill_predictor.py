
from typing import Dict, List


class SkillPredictor:
    def assess_skill(self, move_analyses: List[Dict]) -> Dict:
        if not move_analyses:
            return {"level": "unknown", "accuracy_percentage": 0, "weaknesses": []}

        # Weighted accuracy calculation
        category_weights = {
            "excellent": 1.0,
            "good": 0.8,
            "ok": 0.6,
            "poor": 0.4,
            "mistake": 0.2,
            "blunder": 0.0
        }
        
        total_weight = sum(category_weights[m["category"]] for m in move_analyses)
        accuracy = total_weight / len(move_analyses)
        
        # Skill level thresholds
        if accuracy >= 0.9:
            level = "expert"
        elif accuracy >= 0.7:
            level = "advanced"
        elif accuracy >= 0.5:
            level = "intermediate"
        elif accuracy >= 0.3:
            level = "beginner"
        else:
            level = "novice"

        # Weakness detection
        weaknesses = []
        categories = [m["category"] for m in move_analyses]
        if categories.count("blunder") > len(move_analyses) * 0.1:
            weaknesses.append("Critical blunders")
        if categories.count("mistake") > len(move_analyses) * 0.2:
            weaknesses.append("Frequent mistakes")
            
        return {
            "level": level,
            "accuracy_percentage": round(accuracy * 100, 1),
            "weaknesses": weaknesses
        }