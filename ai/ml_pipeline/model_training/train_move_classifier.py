import tensorflow as tf
import numpy as np
from ml_pipeline.vectorization.chess_vectorizer import ChessVectorizer


def create_model(input_shape):
    model = tf.keras.Sequential(
        [
            tf.keras.layers.Reshape((8, 8, 14), input_shape=(input_shape,)),
            tf.keras.layers.Conv2D(32, (3, 3), activation="relu"),
            tf.keras.layers.MaxPooling2D((2, 2)),
            tf.keras.layers.Conv2D(64, (3, 3), activation="relu"),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dense(4, activation="softmax"),
        ]
    )

    model.compile(
        optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"]
    )
    return model


if __name__ == "__main__":
    # Load processed data
    data = np.load("data/processed/training_data.pgn.npz")
    X = data["X"]
    y = data["y"]

    # Create and train model
    model = create_model(X.shape[1])
    model.fit(X, y, epochs=10, validation_split=0.2, batch_size=64)

    # Save model
    model.save("ml_models/move_classifier.h5")
    print("Model saved to ml_models/move_classifier.h5")
