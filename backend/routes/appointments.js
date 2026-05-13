import express from "express";
import Appointment from "../models/Appointment.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ── GET /api/appointments ─────────────────────────────
// Returns all appointments for the logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/appointments/:id ─────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    res.json({ appointment: appt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/appointments ────────────────────────────
// Book a new appointment
router.post("/", protect, async (req, res) => {
  try {
    const {
      doctorName, department, date, time, fee,
      paymentMethod, paymentProvider, patient,
    } = req.body;

    if (!date || !time || !patient?.fullName || !patient?.email || !patient?.phone) {
      return res.status(400).json({ error: "Date, time, and patient details (name, email, phone) are required." });
    }

    const appt = await Appointment.create({
      userId: req.user._id,
      doctorName: doctorName || "",
      department: department || "",
      date,
      time,
      fee: fee || "Starting ₹499",
      paymentMethod: paymentMethod || "offline",
      paymentProvider: paymentProvider || "",
      paymentStatus: paymentMethod === "online" ? "paid" : "pending",
      patient,
    });

    // Return appointment with a friendly id field for the frontend
    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: { ...appt.toObject(), id: appt._id.toString() },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/appointments/:id ─────────────────────────
// Update / reschedule appointment
router.put("/:id", protect, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    const allowed = ["date", "time", "status", "paymentStatus", "paymentMethod", "paymentProvider"];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) appt[key] = req.body[key];
    });

    await appt.save();
    res.json({ message: "Appointment updated", appointment: appt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/appointments/:id ──────────────────────
// Cancel appointment
router.delete("/:id", protect, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    appt.status = "cancelled";
    await appt.save();
    res.json({ message: "Appointment cancelled", appointment: appt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
