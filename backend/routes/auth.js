import express from "express";
import User from "../models/User.js";
import { generateToken, protect } from "../middleware/auth.js";

const router = express.Router();

// ── POST /api/auth/register ────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const user = await User.create({ name, email, password, phone: phone || "" });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/login ───────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "No account found with this email." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password. Please try again." });
    }

    const token = generateToken(user._id);
    res.json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/logout ──────────────────────────────
router.post("/logout", protect, async (req, res) => {
  // JWT is stateless — client removes the token
  res.json({ message: "Logged out successfully" });
});

// ── GET /api/auth/me ───────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
