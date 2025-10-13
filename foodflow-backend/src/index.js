import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Add .js extension in ES modules

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
