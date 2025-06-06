from transformers import pipeline


class FeedbackService:
    def __init__(self):
        self.feedback_gen = pipeline(
            "text-generation", model="gpt2", max_new_tokens=40, pad_token_id=50256
        )

    def generate_feedback(self, analysis: dict, history: list) -> dict:
        prompt = self._build_prompt(analysis, history)
        output = self.feedback_gen(prompt)[0]["generated_text"]

        # Возьми только 1 предложение и убери prompt-эхо
        response = output.replace(prompt, "").strip().split(".")[0] + "."

        return {
            "strength": analysis.get("move_quality", "Unknown"),
            "suggestion": response,
        }

    def _build_prompt(self, analysis, history) -> str:
        move = analysis.get("san_move", analysis["move"])
        eval_score = analysis.get("eval", "unknown")
        quality = analysis.get("move_quality", "unknown")

        return (
            f"Give feedback for a chess move in one sentence.\n"
            f"The player made the move {move}. "
            f"Evaluation is {eval_score}. "
            f"Move quality is {quality}.\n"
            f"Feedback:"
        )
