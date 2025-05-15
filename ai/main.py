from flask import Flask, request, jsonify
from services.chess_ai_service import ChessAIService
import os

app = Flask(__name__)
ai_service = ChessAIService()


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
    data = request.json
    result = ai_service.analyze_game(data["moves"])
    return jsonify(result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
