from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

def load_model(food_type):
    model_path = os.path.join(MODEL_DIR, f"{food_type}_model.pkl")
    scaler_path = os.path.join(MODEL_DIR, f"{food_type}_scaler.pkl")

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        return None, None

    return joblib.load(model_path), joblib.load(scaler_path)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    food_type = data.get("Food Type")
    category = data.get("Category")
    temp = data.get("Temperature")
    humidity = data.get("Humidity")
    packaging = data.get("Packaging Type")

    model, scaler = load_model(food_type)
    if model is None:
        return jsonify({"error": f"Model for '{food_type}' not found."}), 400

    input_data = np.array([[category, temp, humidity, packaging]])
    input_scaled = scaler.transform(input_data)
    predicted_expiry = model.predict(input_scaled)[0]

    return jsonify({"predicted_expiry_days": max(1, round(predicted_expiry))})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
