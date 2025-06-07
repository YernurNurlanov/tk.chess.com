from flask import Flask, request, jsonify
from services.chess_ai_service import ChessAIService
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
ai_service = ChessAIService()


# Existing endpoints
@app.route("/analyze-move", methods=["POST"])
def analyze_move():
    data = request.json
    result = ai_service.analyze_move(data["fen"], data["move"])
    return jsonify(result)


@app.route("/get-ai-move", methods=["POST"])
def get_ai_move():
    data = request.json
    skill_level = data.get("skill_level", 3)
    result = ai_service.generate_move(data["fen"], skill_level)
    return jsonify(result)


@app.route("/analyze-game", methods=["POST"])
def analyze_game():
    data = request.get_json()
    player_color = data.get("playerColor", "white")

    result = ai_service.analyze_pgn(data["pgn"], player_color)

    move_analyses = result.get("move_analyses")
    if isinstance(move_analyses, dict) and "move_analyses" in move_analyses:
        move_analyses = move_analyses["move_analyses"]  # ✅ fix nested

    if not isinstance(move_analyses, list):
        return jsonify({"error": "Invalid move_analyses format"}), 500

    finalized = ai_service._finalize_analysis(move_analyses)
    finalized["opening"] = result.get("opening", "Неизвестный дебют")
    finalized["skill_profile"] = result.get("skill_profile", {})

    return jsonify(finalized)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=5001)
