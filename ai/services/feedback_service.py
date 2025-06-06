from transformers import pipeline


class FeedbackService:
    def __init__(self):
        self.feedback_gen = pipeline(
            "text-generation", model="gpt-3.5-turbo", max_length=200
        )

    def generate_feedback(self, analysis: dict, history: list) -> str:
        prompt = self._build_prompt(analysis, history)
        return self.feedback_gen(prompt)[0]["generated_text"]

    def _build_prompt(self, analysis, history) -> str:
        return f"""
        As a chess coach, analyze this move:
        - Position: {analysis["fen"]}
        - Move: {analysis["move"]}
        - Stockfish evaluation: {analysis["eval"]}
        - Move classification: {analysis["move_quality"]}
        - Player history: {history[-5:]}
        Provide constructive feedback in Russian focusing on tactical patterns.
        """
