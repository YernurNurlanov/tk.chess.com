from typing import Dict, List


class LearningPath:
    def get_recommendations(self, skill_profile: Dict) -> List[Dict]:
        recs = []
        weaknesses = skill_profile.get("weaknesses", [])
        
        # Русские рекомендации
        if "Критические ошибки в ключевых позициях" in weaknesses:
            recs.append({
                "title": "Изучение ключевых позиций",
                "description": "Пройти 10 упражнений на критические позиции эндшпиля",
                "type": "training",
                "priority": "high"
            })
        
        if "Частые тактические просчёты" in weaknesses:
            recs.append({
                "title": "Тактические тренировки",
                "description": "Ежедневно решать 15 комбинаций средней сложности",
                "type": "puzzles",
                "priority": "medium"
            })
        
        if "Слабый эндшпиль" in weaknesses:
            recs.append({
                "title": "Эндшпильные техники",
                "description": "Изучить 5 классических эндшпильных позиций",
                "type": "study",
                "priority": "medium"
            })
        
        # Общие рекомендации
        if not recs:
            recs.append({
                "title": "Анализ классических партий",
                "description": "Разобрать 3 партии гроссмейстеров в вашем дебюте",
                "type": "study",
                "priority": "medium"
            })
        
        return recs