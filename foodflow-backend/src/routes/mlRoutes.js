const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/predict-expiry", async (req, res) => {
    try {
        const { foodType, category, temperature, humidity, packaging } = req.body;

        if (!foodType || !category || !temperature || !humidity || !packaging) {
            return res.status(400).json({ error: "Missing required fields", received: req.body });
        }

        console.log("📩 Received ML request:", req.body);

             // Send request to Flask ML API
        const response = await axios.post("http://127.0.0.1:5000/predict", {
            "Food Type": foodType,
            "Category": category,
            "Temperature": temperature,
            "Humidity": humidity,
            "Packaging Type": packaging
        });

        res.json(response.data);
    } catch (error) {
        console.error("❌ ML API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get ML prediction" });
    }

      

});


module.exports = router;
