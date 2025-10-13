const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  expiryDate: { type: String, required: false },
  location: { type: String, required: true },
  userId: { type: String, ref: 'User', required: true }
},{ timestamps: true });

module.exports = mongoose.model("Food", foodSchema);
