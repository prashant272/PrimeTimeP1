import config from "./config/config.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import compression from "compression";

import authRoutes from "./routes/authRoutes.js";
import nominationRoutes from "./routes/nominationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import previousEditionRoutes from "./routes/previousEditionRoutes.js";
import developerRoutes from "./routes/developerRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import passport from "passport";
import session from "express-session";
import "./config/passport.js";
import { signToken } from "./middleware/authMiddleware.js";

const app = express();
app.use(cors({
  origin: [
    config.FRONTEND_URL,
    "https://globalhealthcareawards.com",
    "https://www.globalhealthcareawards.com",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Security and Logging
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// DEBUG: Log all requests and capture 401 responses to identify the source
app.use((req, res, next) => {
  console.log(`[DEBUG] 📡 ${req.method} ${req.url}`);
  const originalJson = res.json;
  res.json = function (data) {
    if (res.statusCode === 401) {
      console.log(`[DEBUG] 🛑 401 UNAUTHORIZED for ${req.url}:`, JSON.stringify(data));
    }
    return originalJson.call(this, data);
  };
  next();
});

console.log("🛠️ Server Config Check:", {
  PORT: config.PORT,
  MONGO_URI: config.MONGO_URI ? "LOADED" : "MISSING",
  JWT_SECRET: config.JWT_SECRET === "dev_primetime_secret_change_me" ? "DEFAULT" : "LOADED FROM ENV",
  AWS_BUCKET: config.AWS.BUCKET_NAME,
  FRONTEND: config.FRONTEND_URL
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Session Middleware (Required for Google OAuth state)
app.use(
  session({
    secret: config.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: config.NODE_ENV === "production" },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
});

mongoose
  .connect(config.MONGO_URI, {
    dbName: config.MONGO_DB_NAME || undefined,
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

    // Redirect to frontend /auth-callback with data
    res.redirect(`${config.FRONTEND_URL}/auth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    }))}`);
  }
);

// Backward compatibility
app.get("/api/auth/google/callback", (req, res) => {
  res.redirect(307, `/auth/google/callback?${new URLSearchParams(req.query).toString()}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/nominations", nominationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/previous-editions", previousEditionRoutes);
app.use("/api/developer", developerRoutes);

// Global Error Handler
app.use(errorHandler);

const server = app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}`));
server.timeout = 600000; // 10 minutes for large photo uploads
