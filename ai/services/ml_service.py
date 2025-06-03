import tensorflow as tf
import xgboost as xgb
import joblib
import numpy as np
from sklearn.preprocessing import LabelEncoder
from vectorization.chess_vectorizer import ChessVectorizer
import chess


class MLService:
    def __init__(self):
        # Load models
        self.move_classifier = tf.keras.models.load_model(
            "ai/ml_models/move_classifier.h5"
        )

        self.skill_predictor = xgb.XGBClassifier()
        self.skill_predictor.load_model("ai/ml_models/skill_predictor.json")

        self.anomaly_detector = joblib.load("ai/ml_models/anomaly_detector.joblib")

        self.vectorizer = ChessVectorizer()

        # Load skill encoder
        self.skill_encoder = LabelEncoder()
        self.skill_encoder.classes_ = np.load(
            "ai/ml_models/skill_encoder.npy", allow_pickle=True
        )

    def classify_move(self, board: chess.Board, move: chess.Move) -> dict:
        vec = self.vectorizer.board_to_vector(board)
        prediction = self.move_classifier.predict(np.array([vec]))
        return {
            "blunder": float(prediction[0][0]),
            "mistake": float(prediction[0][1]),
            "good": float(prediction[0][2]),
            "excellent": float(prediction[0][3]),
        }

    def predict_skill(self, embeddings: list) -> dict:
        pred = self.skill_predictor.predict(np.array(embeddings))
        skill_level = self.skill_encoder.inverse_transform(pred)
        return {"level": skill_level[0], "confidence": float(np.max(pred))}

    def detect_anomalies(self, embeddings: list) -> list:
        return self.anomaly_detector.predict(embeddings)
