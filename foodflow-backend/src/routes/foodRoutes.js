const express = require("express");
const Food = require("../models/Food");
const authenticateUser = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Create a new food post
router.post("/", authenticateUser, async (req, res) => {
  try {
    console.log("Received request:", req.body);
    console.log("Authenticated user:", req.user);
    const { title, expiryDate, description, location } = req.body;
    
    const newFood = new Food({
      title,
      expiryDate,
      description,
      location,
      userId: req.user.uid // Get userId from Firebase token
    });

    await newFood.save();
    res.status(201).json({ message: "Food added successfully", food: newFood });
  } catch (error) {
    console.error("Error saving food to MongoDB:", error); 
    res.status(500).json({ error: "Failed to add food" });
  }
});


router.get("/test",(req,res)=>{
  res.send("testing done");
})
// ✅ Get all food posts
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    console.log(foods)
    res.json(foods);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed  " });
  }
});

// ✅ Get a single food item by ID
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: "Food not found" });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Error fetching food item" });
  }
});

// ✅ Get all food items by userId
router.get("/user/:userId", async (req, res) => {
  try {
    const foods = await Food.find({ userId: req.params.userId });
    res.json({ foods });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user's food items" });
  }
});

// ✅ Delete a food item
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ error: "Food not found" });

    if (food.userId.toString() !== req.user.uid) {
      return res.status(403).json({ error: "Unauthorized to delete this food item" });
    }

    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete food item" });
  }
});


module.exports = router;
