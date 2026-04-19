import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import socketIo from "socket.io";
import http from "http";
import os from "os";
import path from "path";

import { connectDB } from "./DBconnection";
import { PORT } from "./config";
import { authenticateJWT } from "./middleware/auth";

import currencyapiRouter  from "./routes/CurrencyRouter";
import securityapiRouter from "./routes/securityRouter";
import priceapiRouter from "./routes/priceRouter";
import uploadController from "./routes/fileUploadRouter";
import userRouter from "./routes/users";
import portfolioRouter from "./routes/portfolio";
import accountapiRouter from "./routes/Account";
import exhangerouter from "./routes/exchangeRateRoutes";
import portfoliotransactionsRouter from "./routes/portfoliotransactionsRouter";
import heatMapRouter from "./routes/heatMapRouter";
import importRouter from "./routes/importRouter";
import voiceRouter from "./routes/voiceRouter";
import brokerRouter from "./routes/brokerRouter";

require("./Cron/cronjob");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS — allow all in dev; lock down in production via env
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:3003"];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error("CORS: origin not allowed"));
  },
  credentials: true,
}));

// Rate limiting — 100 requests per 15 min per IP globally
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
app.use(globalLimiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again later." },
});

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

// Health check — no auth required
app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// Apply JWT to all routes except public ones
app.all("*", function (req, res, next) {
  const publicRoutes = ["/api/users/token", "/api/users/register", "/health"];
  if (!publicRoutes.includes(req.originalUrl.split("?")[0])) {
    authenticateJWT(req, res, next);
  } else {
    next();
  }
});

// Connect to MongoDB
connectDB();

// Define routes that need authentication

// Auth — stricter rate limit
app.use("/api/users/token", authLimiter);
app.use("/api/users/register", authLimiter);

// Routes
app.use("/api/security", securityapiRouter);
app.use("/api/currency", currencyapiRouter);
app.use("/api/price", priceapiRouter);
app.use("/api/upload", uploadController);
app.use("/api/users", userRouter);
app.use("/api/portfolio", portfolioRouter);
app.use("/api/portfoliotransactions", portfoliotransactionsRouter);
app.use("/api/heatmap", heatMapRouter);
app.use("/api/account", accountapiRouter);
app.use("/api/exhangerate", exhangerouter);
app.use("/api/import", importRouter);
app.use("/api/voice", voiceRouter);
app.use("/api/broker", brokerRouter);

// Centralized error handler — must be AFTER all routes
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
});

// Protected route
// app.get("/api/protected", authenticateJWT, (req, res) => {
//   res.json({ message: "You are authorized!" });
// });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  const cookiePath = path.join(os.homedir(), ".yf2-cookies.json");
  console.log('cookiePath', cookiePath);
});
