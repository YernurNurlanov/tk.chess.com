# tk.chess.com/ai/services/skill_predictor.py
from typing import Dict, List

class SkillPredictor:
    def assess_skill(self, move_analyses: List[Dict]) -> Dict:
        if not move_analyses:
            return {
                "level": "Неизвестен",
                "accuracy_percentage": 0,
                "weaknesses": [],
                "opening_accuracy": 0,
                "endgame_accuracy": 0
            }

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
        
        # Уровни навыков
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

        level_map = {
            "expert": "Эксперт",
            "advanced": "Продвинутый",
            "intermediate": "Средний",
            "beginner": "Начинающий",
            "novice": "Новичок"
        }
        
        # Рассчет точности по фазам
        def calculate_phase_accuracy(phase):
            phase_moves = [m for m in move_analyses if m.get('phase') == phase]
            if not phase_moves:
                return 0
            return sum(category_weights[m['category']] for m in phase_moves) / len(phase_moves)

        opening_acc = calculate_phase_accuracy("opening")
        endgame_acc = calculate_phase_accuracy("endgame")
        
        # Определение слабых мест
        weaknesses_ru = []
        categories = [m["category"] for m in move_analyses]
        
        if categories.count("blunder") > len(move_analyses) * 0.1:
            weaknesses_ru.append("Критические ошибки в ключевых позициях")
        if categories.count("mistake") > len(move_analyses) * 0.2:
            weaknesses_ru.append("Частые тактические просчёты")
        if any(m.get("phase") == 'endgame' and m["category"] in ['mistake', 'blunder'] for m in move_analyses):
            weaknesses_ru.append("Слабый эндшпиль")
            
        return {
            "level": level_map[level],
            "accuracy_percentage": round(accuracy * 100, 1),
            "weaknesses": weaknesses_ru,
            'opening_accuracy': round(calculate_phase_accuracy('opening') * 100, 1),
            'middlegame_accuracy': round(calculate_phase_accuracy('middlegame') * 100, 1),
            'endgame_accuracy': round(calculate_phase_accuracy('endgame') * 100, 1),
        }
    