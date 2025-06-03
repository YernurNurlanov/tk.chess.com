import requests
import hashlib
import json


class DBService:
    def __init__(self, java_backend_url="http://localhost:8080"):
        self.base_url = java_backend_url

    def get_position(self, fen: str) -> dict:
        fen_hash = hashlib.sha256(fen.encode()).hexdigest()
        try:
            response = requests.get(f"{self.base_url}/positions/{fen_hash}", timeout=5)
            return response.json() if response.status_code == 200 else None
        except:
            return None

    def save_position(self, fen: str, evaluation: dict, embedding: list):
        fen_hash = hashlib.sha256(fen.encode()).hexdigest()
        data = {
            "fen_hash": fen_hash,
            "fen": fen,
            "evaluation": evaluation,
            "ml_embedding": embedding,
        }
        try:
            requests.post(f"{self.base_url}/positions", json=data, timeout=5)
        except:
            pass  # Log error in production

    def save_game_analysis(self, game_id: str, analyses: list):
        try:
            requests.post(
                f"{self.base_url}/analyses",
                json={"game_id": game_id, "analyses": analyses},
                timeout=10,
            )
        except:
            pass  # Log error in production
