import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Nomination from "../models/Nomination.js";
import { authenticate, requireAdmin, signToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// List all nominations (admin)
router.get("/nominations", authenticate, requireAdmin, async (_req, res, next) => {
  try {
    const docs = await Nomination.find({})
      .populate("user", "email name role")
      .sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    next(err);
  }
});

// Update nomination status
router.patch("/nominations/:id/status", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body || {};
    const updated = await Nomination.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("user", "email name role");

    if (!updated) return res.status(404).json({ message: "Nomination not found" });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Update nomination (admin)
router.put("/nominations/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const payload = req.body || {};
    // prevent user reassignment
    delete payload.user;

    const updated = await Nomination.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate("user", "email name role");

    if (!updated) return res.status(404).json({ message: "Nomination not found" });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

// Delete nomination (admin)
router.delete("/nominations/:id", authenticate, requireAdmin, async (req, res, next) => {
  try {
    const deleted = await Nomination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Nomination not found" });
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

