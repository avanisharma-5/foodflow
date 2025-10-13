const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const foodRoutes = require('./routes/foodRoutes');
const userRoutes = require('./routes/userRoutes');
const mlRoutes = require('./routes/mlRoutes');
const app = express();

app.options("*", cors());

const allowedOrigins = ['http://localhost:5000', 'http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"], // Explicitly allow Authorization header
  credentials: true, // Allow cookies/auth headers
}));


app.use(express.json());

console.log("✅ Registering Food Routes...");

app.use('/api/foods', foodRoutes);
app.use('/api', userRoutes);
app.use("/ml", mlRoutes);

// ✅ Log all registered routes
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`📌 Registered Route: ${r.route.path} [${Object.keys(r.route.methods).join(",").toUpperCase()}]`);
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
