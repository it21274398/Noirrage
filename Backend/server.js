import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";

// Initialize dotenv and express
dotenv.config();
const app = express();

// Fix "__dirname" in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// Enable CORS for all origins or just from localhost:3000
app.use(cors({
  origin: "http://localhost:3000", // Or "*" for all origins
  methods: "GET,POST,PUT,DELETE", // Allow methods as per your API
  allowedHeaders: "Content-Type, Authorization", // Allow specific headers
}));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes);

// Serve static files if necessary (for image uploading or front-end assets)
// Example of serving static files from 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Handle file upload size limit (5MB in this case)
app.use(express.json({ limit: "50mb" })); // For large payloads like Base64 images

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
