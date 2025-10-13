import sys
import os
from flask import Flask, request, jsonify

# Ensure the src directory is in the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../src")))

from src.ml.predict import predict_expiry  # Import ML function

app = Flask(__name__)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    print("Received data:", data) 

    required_fields = ["Food Type", "Category", "Temperature", "Humidity", "Packaging Type"]
    
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    try:
        result = predict_expiry(
            data["Food Type"],
            data["Category"],
            data["Temperature"],
            data["Humidity"],
            data["Packaging Type"]
        )

        # Handle invalid food types
        if isinstance(result, str):
            return jsonify({"error": result}), 400

        return jsonify({"predicted_days_until_expiry": result})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
