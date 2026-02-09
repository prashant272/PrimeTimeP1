import express from "express";

import Nomination from "../models/Nomination.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { nominationSchema, validate } from "../middleware/validators.js";

const router = express.Router();

// Create a nomination (logged-in user)
router.post("/", authenticate, nominationSchema, validate, async (req, res, next) => {
  try {
    const payload = req.body || {};

    const nomination = await Nomination.create({
      ...payload,
      user: req.user.id,
    });

    return res.status(201).json(nomination);
  } catch (err) {
    next(err);
  }
});

// Fetch current user's nominations
router.get("/my", authenticate, async (req, res, next) => {
  try {
    const docs = await Nomination.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json(docs);
  } catch (err) {
    next(err);
  }
});

// Fetch a single nomination by ID (must belong to the user)
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const nomination = await Nomination.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).lean();

    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found" });
    }

    return res.json(nomination);
  } catch (err) {
    next(err);
  }
});

// Update a nomination (only if status is 'nominated')
router.put("/:id", authenticate, nominationSchema, validate, async (req, res, next) => {
  try {
    const nomination = await Nomination.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!nomination) {
      return res.status(404).json({ message: "Nomination not found" });
    }

    if (nomination.status !== "nominated") {
      return res.status(403).json({
        message: "This nomination can no longer be edited as it is under evaluation.",
      });
    }

    const payload = req.body || {};

    // Update fields
    Object.assign(nomination, payload);

    await nomination.save();
    return res.json(nomination);
  } catch (err) {
    next(err);
  }
});

export default router;

