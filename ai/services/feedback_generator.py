from typing import Dict, List


class FeedbackGenerator:
    def get_feedback(self, move_analysis: Dict, history: List[Dict]) -> Dict:
        return {
            "strength": self._get_strength_ru(move_analysis),
            "suggestion": self._get_suggestion_ru(move_analysis),
            "pattern_feedback": self._detect_patterns_ru(history),
        }

    def _get_strength_ru(self, move):
        descriptions = {
            "excellent": "Отличный ход! Лучший возможный вариант",
            "good": "Хороший ход! Один из лучших вариантов",
            "ok": "Приемлемый ход, но есть лучше варианты", 
            "poor": "Неточность. Рассмотрите другие варианты",
            "mistake": "Ошибка! Ухудшает вашу позицию",
            "blunder": "Грубая ошибка! Может привести к поражению"
        }
        return descriptions.get(move["category"], "Анализ хода")

    def _get_suggestion_ru(self, move):
        suggestions = {
            "excellent": "Продолжайте в том же духе!",
            "good": "Хороший выбор, продолжайте!",
            "ok": f"Рассмотрите вариант {move['top_suggestion']} для улучшения позиции",
            "poor": f"Лучше было {move['top_suggestion']} для сохранения преимущества",
            "mistake": f"Рекомендуется {move['top_suggestion']} для исправления позиции",
            "blunder": f"Срочно требуется {move['top_suggestion']} для защиты"
        }
        return suggestions.get(move["category"], "Анализ рекомендаций")

    def _detect_patterns_ru(self, history):
        patterns = []
        if len([m for m in history if m["piece"] == "p"]) > 3:
            patterns.append("Частые ошибки в пешечной структуре")
        if len([m for m in history if m["piece"] == "k"]) > 2:
            patterns.append("Слабый контроль центра королём")
        return patterns if patterns else ["Стабильная игра, продолжайте!"]