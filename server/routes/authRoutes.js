import express from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { signToken } from "../middleware/authMiddleware.js";
import { registerSchema, loginSchema, validate } from "../middleware/validators.js";

const router = express.Router();

// Register user (optionally as admin via secret code)
router.post("/register", registerSchema, validate, async (req, res, next) => {
  try {
    const { name, email, password, secretCode } = req.body;


    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Warn clearly in logs if someone is trying to use secretCode
    // but the backend is not configured with ADMIN_CREATE_SECRET.
    if (secretCode && !process.env.ADMIN_CREATE_SECRET) {
      console.warn(
        "ADMIN_CREATE_SECRET is not set in environment; cannot create admin users securely."
      );
    }

    const role =
      secretCode &&
        process.env.ADMIN_CREATE_SECRET &&
        secretCode === process.env.ADMIN_CREATE_SECRET
        ? "admin"
        : "user";

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    });

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Login normal user
router.post("/login", loginSchema, validate, async (req, res, next) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;







