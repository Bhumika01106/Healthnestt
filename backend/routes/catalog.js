import express from "express";
import { Doctor, Department } from "../models/Catalog.js";

const router = express.Router();

// ── Seed data (inserted once if DB is empty) ──────────
const seedDoctors = [
  { name: "Dr. Neha Singh",    department: "Cardiology",    specialization: "Interventional cardiologist", fee: "₹1,200" },
  { name: "Dr. Rajiv Kumar",   department: "Neurology",     specialization: "Stroke & migraine specialist", fee: "₹1,100" },
  { name: "Dr. Anjali Mehta",  department: "Orthopedics",   specialization: "Joint pain & sports injuries", fee: "₹950" },
  { name: "Dr. Priya Sharma",  department: "Dermatology",   specialization: "Skin wellness therapies",      fee: "₹850" },
  { name: "Dr. Arjun Verma",   department: "Pediatrics",    specialization: "Child health & immunizations", fee: "₹800" },
  { name: "Dr. Sunita Patel",  department: "Gynecology",    specialization: "Women's health specialist",    fee: "₹1,000" },
  { name: "Dr. Vikram Bose",   department: "Oncology",      specialization: "Cancer diagnosis & treatment", fee: "₹1,500" },
  { name: "Dr. Meera Joshi",   department: "Ophthalmology", specialization: "Eye care & vision therapy",    fee: "₹750" },
];

const seedDepartments = [
  { name: "Cardiology",    description: "Expert heart care, diagnostics & cardiac consultations." },
  { name: "Neurology",     description: "Advanced brain & nervous system specialist care." },
  { name: "Orthopedics",   description: "Bone, joint & sports medicine consultations." },
  { name: "Dermatology",   description: "Skin, hair & cosmetic health treatments." },
  { name: "Pediatrics",    description: "Comprehensive care for infants, children & teens." },
  { name: "Gynecology",    description: "Women's health, prenatal & reproductive care." },
  { name: "Oncology",      description: "Cancer screening, treatment & supportive care." },
  { name: "Ophthalmology", description: "Complete eye care, vision tests & surgery." },
];

async function ensureSeeded() {
  const count = await Doctor.countDocuments();
  if (count === 0) {
    await Doctor.insertMany(seedDoctors);
    await Department.insertMany(seedDepartments);
    console.log("🌱 Catalog seeded with doctors & departments");
  }
}

// Run seed check at startup (called lazily on first request)
let seeded = false;
const seedOnce = async () => {
  if (!seeded) { await ensureSeeded(); seeded = true; }
};

// ── GET /api/doctors ──────────────────────────────────
router.get("/doctors", async (req, res) => {
  try {
    await seedOnce();
    const doctors = await Doctor.find({ available: true });
    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/departments ──────────────────────────────
router.get("/departments", async (req, res) => {
  try {
    await seedOnce();
    const departments = await Department.find();
    res.json({ departments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
