import pandas as pd
import numpy as np
import joblib
import os
import re
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

# Load dataset
df = pd.read_excel("C:/Users/Administrator/Desktop/mini project/foodflow/foodflow-backend/src/ml/extended_cooked_food_expiry_data.xlsx")

os.makedirs("models", exist_ok=True)

# Dictionary to store LabelEncoders
label_encoders = {}

# Convert categorical columns using Label Encoding
categorical_columns = ["Category", "Packaging Type"]

for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])  # Transform column
    label_encoders[col] = le  # Store encoder

# Function to clean file names
def clean_filename(name):
    return re.sub(r'[^\w\s-]', '', name).replace(' ', '_')

# Train a separate model for each food type
food_types = df["Food Type"].unique()

for food in food_types:
    print(f"Training model for {food}...")

    # Filter data for the specific food type
    food_df = df[df["Food Type"] == food].copy()

    # Drop "Food Type" column since it's constant here
    X = food_df.drop(columns=["Food Type", "Days Until Expiry"])
    y = food_df["Days Until Expiry"]

    # Normalize numerical features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate model
    y_pred = model.predict(X_test)
    print(f"{food} MAE:", mean_absolute_error(y_test, y_pred))
    print(f"{food} R2 Score:", r2_score(y_test, y_pred))

    # Clean food name for filename
    clean_food_name = clean_filename(food)

    # Save model and scaler
    joblib.dump(model, f"models/{clean_food_name}_model.pkl")
    joblib.dump(scaler, f"models/{clean_food_name}_scaler.pkl")

print("All models saved successfully!")
