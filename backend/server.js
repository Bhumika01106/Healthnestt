import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import profileRoutes from "./routes/profile.js";
import catalogRoutes from "./routes/catalog.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/healthnest";

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/profile",      profileRoutes);
app.use("/api/doctors",      catalogRoutes);
app.use("/api/departments",  catalogRoutes);

// ── Health check ───────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "HealthNest API is running 🏥" });
});

// ── Error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// ── Start ──────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected:", MONGO_URI);
    app.listen(PORT, () => console.log(`🚀 HealthNest API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
