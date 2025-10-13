import joblib
import numpy as np
import pandas as pd
import os
import re
import json

# Directory where models are saved
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")

def clean_filename(name):
    """Sanitize food type names for file storage (removes special characters and spaces)."""
    return re.sub(r'[^\w\s-]', '', name).replace(' ', '_')

def predict_expiry(food_type, category, temp, humidity, packaging):
    try:
        # Convert food type to match saved model file name
        clean_food_name = clean_filename(food_type)

        # Construct paths for model and scaler
        model_path = os.path.join(MODEL_DIR, f"{clean_food_name}_model.pkl")
        scaler_path = os.path.join(MODEL_DIR, f"{clean_food_name}_scaler.pkl")
        encoder_path = os.path.join(MODEL_DIR, "label_encoders.pkl")

        # Ensure models exist
        if not os.path.exists(model_path) or not os.path.exists(scaler_path) or not os.path.exists(encoder_path):
            return {"error": f"Model for '{food_type}' not found. Please check the food type."}

        # Load model, scaler, and label encoders
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        label_encoders = joblib.load(encoder_path)

        # Encode categorical features
        category_encoded = label_encoders["Category"].transform([category])[0] if isinstance(category, str) else category
        packaging_encoded = label_encoders["Packaging Type"].transform([packaging])[0] if isinstance(packaging, str) else packaging

        # Prepare input data in the **correct order**
        input_data = pd.DataFrame([[category_encoded, temp, humidity, packaging_encoded]], 
                                  columns=["Category", "Temperature (°C)", "Humidity (%)", "Packaging Type"])

        # Apply scaling to **all features** as done during training
        input_scaled = scaler.transform(input_data)

        # Predict expiry days
        predicted_expiry = model.predict(input_scaled)[0]

        return {"predicted_expiry_days": max(1, round(predicted_expiry))}  # Ensure at least 1 day

    except KeyError as e:
        return {"error": f"Invalid Input: {e}. Please check if the category or packaging type is correct."}
    except Exception as e:
        return {"error": str(e)}

# Example Prediction Test
if __name__ == "__main__":
     try:
        food_type = sys.argv[1]
        category = sys.argv[2]
        temperature = float(sys.argv[3])
        humidity = float(sys.argv[4])
        packaging = sys.argv[5]

        result = predict_expiry(food_type, category, temperature, humidity, packaging)
        print(json.dumps(result))  # Return JSON to Node.js
     except Exception as e:
        print(json.dumps({"error": str(e)}))