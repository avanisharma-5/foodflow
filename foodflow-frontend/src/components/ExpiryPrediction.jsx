import { useState } from "react";

function ExpiryPrediction() {
    const [foodType, setFoodType] = useState("");
    const [category, setCategory] = useState("");
    const [temperature, setTemperature] = useState("");
    const [humidity, setHumidity] = useState("");
    const [packaging, setPackaging] = useState("");
    const [dateInput, setDateInput] = useState(""); // Single date input (Manufacture/Cooked)
    const [prediction, setPrediction] = useState(null);
    const [computedExpiryDate, setComputedExpiryDate] = useState("");

    const handlePredict = async () => {
        if (!foodType || !category || !temperature || !humidity || !packaging || !dateInput) {
            alert("❌ Please fill in all fields.");
            return;
        }
    
        const requestData = {
            foodType,
            category,
            temperature: parseFloat(temperature), // Ensure numeric values
            humidity: parseFloat(humidity),
            packaging,
            manufactureDate: dateInput, // ✅ Include this field
        };
    
        console.log("🚀 Sending request to ML API:", requestData); // Debugging log
    
        try {
            const response = await fetch("http://localhost:5000/ml/predict-expiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestData),
            });
    
            const data = await response.json();
            console.log("full api response ",data);

            const predictedDays = data.predicted_days_until_expiry?.predicted_expiry_days; 
            console.log(predictedDays);
            if (typeof predictedDays !== "number") {
                console.error("❌ Invalid prediction:", predictedDays);
                alert("Error: Received an invalid expiry prediction.");
                return;
            }
            

            if (response.ok) {
                setPrediction(predictedDays);

                if (!dateInput || isNaN(new Date(dateInput).getTime())) {
                    console.error("❌ Invalid Manufacture Date:", dateInput);
                    alert("Please enter a valid Manufacturing Date.");
                    return;
                }
    
                // Compute expiry date
                const baseDate = new Date(dateInput);
                if (!predictedDays || isNaN(predictedDays)) {
                    console.error("❌ Invalid predicted_expiry_days:", data.predicted_expiry_days);
                    alert("Failed to get a valid expiry prediction.");
                    return;
                }

                if (isNaN(baseDate.getTime())) {
                    console.error("❌ Invalid Manufacture Date:", dateInput);
                    alert("Invalid Manufacture Date. Please enter a valid date.");
                    return;
                }
                
                baseDate.setDate(baseDate.getDate() + predictedDays - 1);
                // Extract day, month, and year
const day = String(baseDate.getDate()).padStart(2, "0");
const month = String(baseDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
const year = baseDate.getFullYear();

// Format as DD-MM-YYYY
const formattedExpiryDate = `${day}-${month}-${year}`;

setComputedExpiryDate(formattedExpiryDate);
console.log("✅ Computed Expiry Date:", formattedExpiryDate);

            } else {
                console.error("❌ Prediction error:", data);
            }
        } catch (error) {
            console.error("❌ Error predicting expiry:", error);
        }
    
    
    };

    return (
        <div>
            <h2>Predict Expiry Date</h2>
            <input type="text" placeholder="Food Type" onChange={(e) => setFoodType(e.target.value)} />
            <input type="text" placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
            <input type="number" placeholder="Temperature (°C)" onChange={(e) => setTemperature(e.target.value)} />
            <input type="number" placeholder="Humidity (%)" onChange={(e) => setHumidity(e.target.value)} />
            <input type="text" placeholder="Packaging Type" onChange={(e) => setPackaging(e.target.value)} />
            
            {/* Single Date Input */}
            <input type="date" onChange={(e) => setDateInput(e.target.value)} />
            
            <button onClick={handlePredict}>Predict</button>

            {prediction !== null && (
                <p>Predicted Expiry: {prediction} days</p>
            )}

            {computedExpiryDate && (
                <p>Final Expiry Date: {computedExpiryDate}</p>
            )}
        </div>
    );
}

export default ExpiryPrediction;
