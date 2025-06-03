import os
import sys
from sklearn.ensemble import IsolationForest
import joblib
import numpy as np

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
)

from ml_pipeline.vectorization.chess_vectorizer import ChessVectorizer


def load_training_data():
    """Load pre-processed board tensors"""
    try:
        data = np.load("data/processed/training_data.npz")
        X = data["X"]

        # Verify shape - should be (num_samples, embedding_size)
        if len(X.shape) != 2:
            raise ValueError(f"Expected 2D array, got shape {X.shape}")

        print(f"Loaded {X.shape[0]} samples with {X.shape[1]} features each")
        return X

    except Exception as e:
        print(f"Error loading data: {e}")
        raise


def train_and_save_model(X):
    """Train and save anomaly detector"""
    print(f"Training on {len(X)} samples...")
    model = IsolationForest(
        n_estimators=200, contamination=0.05, random_state=42, n_jobs=-1, verbose=1
    )
    model.fit(X)

    os.makedirs("ml_models", exist_ok=True)
    joblib.dump(model, "ml_models/anomaly_detector.joblib")
    print("Model saved to ml_models/anomaly_detector.joblib")


if __name__ == "__main__":
    try:
        X = load_training_data()
        train_and_save_model(X)

        # Save processed data for later use
        os.makedirs("data/processed", exist_ok=True)
        np.savez_compressed("data/processed/embeddings.npz", X=X)
        print("Embeddings saved")

    except Exception as e:
        print(f"Training failed: {e}")
        sys.exit(1)
