import express from "express";
import Appointment from "../models/Appointment.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Helper: add id + frontend-friendly field aliases to every appointment object
const toFrontend = (appt) => {
  const obj = appt.toObject ? appt.toObject() : { ...appt };
  return {
    ...obj,
    id:              obj._id?.toString() || obj.id || "",
    // frontend reads "doctor", "appointmentDate", "appointmentTime"
    doctor:          obj.doctorName  || "",
    appointmentDate: obj.date        || "",
    appointmentTime: obj.time        || "",
  };
};

// ── GET /api/appointments ─────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ appointments: appointments.map(toFrontend) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/appointments/:id ─────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });
    res.json({ appointment: toFrontend(appt) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/appointments ────────────────────────────
router.post("/", protect, async (req, res) => {
  try {
    const {
      doctorName, department, date, time, fee,
      paymentMethod, paymentProvider, patient,
    } = req.body;

    if (!date || !time || !patient?.fullName || !patient?.email || !patient?.phone) {
      return res.status(400).json({
        error: "Date, time, and patient details (name, email, phone) are required.",
      });
    }

    const appt = await Appointment.create({
      userId:          req.user._id,
      doctorName:      doctorName      || "",
      department:      department      || "",
      date,
      time,
      fee:             fee             || "Starting ₹499",
      paymentMethod:   paymentMethod === "online" ? "online" : "offline",
      paymentProvider: paymentProvider || "",
      paymentStatus:   paymentMethod === "online" ? "paid" : "pending",
      patient,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: toFrontend(appt),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/appointments/:id ─────────────────────────
router.put("/:id", protect, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    const allowed = ["date", "time", "status", "paymentStatus", "paymentMethod", "paymentProvider"];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) appt[key] = req.body[key];
    });

    await appt.save();
    res.json({ message: "Appointment updated", appointment: toFrontend(appt) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/appointments/:id ──────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
    if (!appt) return res.status(404).json({ error: "Appointment not found" });

    appt.status = "cancelled";
    await appt.save();
    res.json({ message: "Appointment cancelled", appointment: toFrontend(appt) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
