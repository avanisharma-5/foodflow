const express = require('express');
const User = require('../models/user');

const router = express.Router();

// Save user details after Firebase signup
router.post('/saveUser', async (req, res) => {
    try {
        const { uid, username, email, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ uid });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ uid, username, email, phone, address });
        await newUser.save();

        res.status(201).json({ message: "User saved successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
