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
    try:
        data = request.json
        if not data or "pgn" not in data:
            return jsonify({"error": "Invalid request data"}), 400

        result = ai_service.analyze_pgn(data["pgn"], data.get("playerColor", "white"))

        if "error" in result:
            return jsonify(result), 400

        return jsonify(result)

    except Exception as e:
        print(f"Error in analyze_game endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)
