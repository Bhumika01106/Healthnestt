import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ── GET /api/profile ──────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const userObj = req.user.toJSON ? req.user.toJSON() : { ...req.user._doc };
    userObj.profileImage = userObj.avatar || "";
    res.json({ user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/profile ──────────────────────────────────
// Update profile — user can update name, phone, DOB, gender, address, bloodGroup, avatar
// Password change is handled separately via /api/profile/password
router.put("/", protect, async (req, res) => {
  try {
    const allowed = ["name", "phone", "dateOfBirth", "gender", "address", "bloodGroup", "avatar"];
    const user = await User.findById(req.user._id);

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) user[key] = req.body[key];
    });

    // Frontend sends "profileImage" — map it to "avatar" in DB
    if (req.body.profileImage !== undefined) {
      user.avatar = req.body.profileImage;
    }

    await user.save();
    const userObj = user.toJSON();
    // Return both field names so frontend always gets profileImage
    userObj.profileImage = userObj.avatar || "";
    res.json({ message: "Profile updated successfully", user: userObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/profile/password ─────────────────────────
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both current and new password are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters." });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
