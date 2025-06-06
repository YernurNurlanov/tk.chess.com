import xgboost as xgb
import numpy as np
from sklearn.preprocessing import LabelEncoder
import os
from sklearn.model_selection import train_test_split
import joblib  # For saving as .pkl

# Ensure directories exist
os.makedirs("ml_models", exist_ok=True)


def train_skill_predictor():
    try:
        # Load game data
        data = np.load(
            "/Users/karimabismeldinova/Documents/3kurs/tk.chess.com/ai/data/processed/training_data.npz"
        )
        print("Available keys in NPZ file:", list(data.keys()))

        # Debug: Print shapes
        print(f"X shape: {data['X'].shape}")
        print(f"y shape: {data['y'].shape}")
        print(f"ratings shape: {data['ratings'].shape}")

        # Use the correct keys
        X = data["X"]
        ratings = data["ratings"]

        # Create skill labels
        player_ratings = np.concatenate((ratings[:, 0], ratings[:, 1]))
        bins = [0, 1000, 1400, 1800, 2200, 3000]
        labels = ["novice", "beginner", "intermediate", "advanced", "expert"]
        y_binned = np.digitize(player_ratings, bins)
        y = np.array([labels[i - 1] for i in y_binned])

        # Align shapes
        if len(X) * 2 == len(y):
            X = np.repeat(X, 2, axis=0)
        elif len(X) != len(y):
            min_len = min(len(X), len(y))
            X = X[:min_len]
            y = y[:min_len]

        # Encode labels
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)

        # Train/test split
        X_train, X_val, y_train, y_val = train_test_split(
            X, y_encoded, test_size=0.2, random_state=42
        )

        # Train model
        model = xgb.XGBClassifier(
            objective="multi:softprob",
            num_class=len(labels),
            n_estimators=1000,
            max_depth=6,
            learning_rate=0.05,
            early_stopping_rounds=10,
            eval_metric="mlogloss",
        )

        model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=True)

        # Save as .pkl files
        joblib.dump(model, "ml_models/skill_predictor.pkl")
        joblib.dump(le, "ml_models/skill_encoder.pkl")

        print("\nModel trained successfully!")
        print(f"Best iteration: {model.best_iteration}")
        print(f"Best score: {model.best_score}")
        print(f"Classes: {le.classes_}")
        print(
            f"Saved to: ml_models/skill_predictor.pkl and ml_models/skill_encoder.pkl"
        )

        return model, le

    except Exception as e:
        print(f"\nError training skill predictor: {str(e)}")
        raise


if __name__ == "__main__":
    train_skill_predictor()
