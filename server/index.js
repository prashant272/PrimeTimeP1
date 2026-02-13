import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";

import authRoutes from "./routes/authRoutes.js";
import nominationRoutes from "./routes/nominationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import { signToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

// Security and Logging
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cors({
  origin: [
    "https://www.globalhealthcareawards.com",
    "https://globalhealthcareawards.com",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  methods: ["GET", "POST", "PUT", "DELETE" ,"PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

// Session Middleware (Required for Google OAuth state)
app.use(
  session({
    secret: process.env.JWT_SECRET || "google-auth-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1/primetime_awards";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || undefined,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "PrimeTime Awards API" });
});

// Google Auth Initiation
app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Auth Callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login?error=google_auth_failed" }),
  (req, res) => {
    const user = req.user;
    const token = signToken({ id: user._id, email: user.email, role: user.role, name: user.name });

    const frontendUrl = process.env.FRONTEND_URL || "https://www.globalhealthcareawards.com";

    // Redirect to frontend /auth-callback with data, which will then seamlessly navigate to /nominate
    res.redirect(`${frontendUrl}/auth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }))}`);
  }
);

// Backward compatibility or alternative path
app.get("/api/auth/google/callback", (req, res) => {
  res.redirect(307, `/auth/google/callback?${new URLSearchParams(req.query).toString()}`);
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/nominations", nominationRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
