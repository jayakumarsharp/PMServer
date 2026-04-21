import express from "express";
import { ensureLoggedIn } from "../middleware/auth";
import {
  getSupportedBrokers,
  getAuthUrl,
  connectBroker,
  handleOAuthCallback,
  syncBrokerPositions,
  getBrokerStatus,
  createBrokerConfig,
  getBrokerConfigsByUser,
  getBrokerConfigById,
  updateBrokerConfig,
  deleteBrokerConfig,
} from "../services/brokerService";
import { validate } from "../validations/schemas";
import { createBrokerConfigSchema, updateBrokerConfigSchema } from "../validations/schemas";

const brokerRouter = express.Router();

// GET /api/broker/supported — list of supported brokers
brokerRouter.get("/supported", async (_req, res, next) => {
  try { res.json(await getSupportedBrokers()); } catch (e) { next(e); }
});

// GET /api/broker/status — user's connected brokers (no secrets)
brokerRouter.get("/status", ensureLoggedIn, async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    res.json(await getBrokerStatus(userId));
  } catch (e) { next(e); }
});

// POST /api/broker/connect — save API key + secret for a broker
brokerRouter.post("/connect", ensureLoggedIn, async (req, res, next) => {
  try {
    const { broker, apiKey, apiSecret } = req.body;
    if (!broker || !apiKey) return res.status(400).json({ error: "broker and apiKey are required" });
    const cred = await connectBroker({ userId: req.user._id || req.user.id, broker, apiKey, apiSecret });
    res.json({ connected: true, broker: cred.broker });
  } catch (e) { next(e); }
});

// GET /api/broker/:broker/auth-url — get OAuth URL for the broker
brokerRouter.get("/:broker/auth-url", ensureLoggedIn, async (req, res, next) => {
  try {
    const url = await getAuthUrl(req.params.broker, req.user._id || req.user.id);
    res.json({ url });
  } catch (e) { next(e); }
});

// GET /api/broker/callback/:broker — OAuth callback (redirect from broker)
brokerRouter.get("/callback/:broker", async (req, res, next) => {
  try {
    const { code, state } = req.query;
    // In production derive userId from state param (encode it when building auth URL)
    // For now we require it as query param for simplicity
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId missing in callback" });
    await handleOAuthCallback({ broker: req.params.broker, code, userId });
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/broker?connected=${req.params.broker}`);
  } catch (e) { next(e); }
});

// POST /api/broker/:broker/sync — sync positions from broker into a portfolio
brokerRouter.post("/:broker/sync", ensureLoggedIn, async (req, res, next) => {
  try {
    const { portfolioId } = req.body;
    if (!portfolioId) return res.status(400).json({ error: "portfolioId is required" });
    const result = await syncBrokerPositions({
      userId: req.user._id || req.user.id,
      broker: req.params.broker,
      portfolioId,
    });
    res.json(result);
  } catch (e) { next(e); }
});

// ── Broker fee config endpoints ───────────────────────────────────────────────

// POST /api/broker/config — create a broker fee config (e.g. "VIO Bank, buy $0.50, sell $0.50")
brokerRouter.post("/config", validate(createBrokerConfigSchema), async (req, res, next) => {
  try {
    const config = await createBrokerConfig(req.body);
    res.status(201).json(config);
  } catch (e) { next(e); }
});

// GET /api/broker/config?user_id=xxx — list all broker configs for a user
brokerRouter.get("/config", async (req, res, next) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "user_id query param is required" });
    res.json(await getBrokerConfigsByUser(user_id));
  } catch (e) { next(e); }
});

// GET /api/broker/config/:id — get a single broker config
brokerRouter.get("/config/:id", async (req, res, next) => {
  try {
    const config = await getBrokerConfigById(req.params.id);
    if (!config) return res.status(404).json({ error: "Broker config not found" });
    res.json(config);
  } catch (e) { next(e); }
});

// PATCH /api/broker/config/:id — update a broker config
brokerRouter.patch("/config/:id", validate(updateBrokerConfigSchema), async (req, res, next) => {
  try {
    const config = await updateBrokerConfig(req.params.id, req.body);
    if (!config) return res.status(404).json({ error: "Broker config not found" });
    res.json(config);
  } catch (e) { next(e); }
});

// DELETE /api/broker/config/:id — delete a broker config
brokerRouter.delete("/config/:id", async (req, res, next) => {
  try {
    const config = await deleteBrokerConfig(req.params.id);
    if (!config) return res.status(404).json({ error: "Broker config not found" });
    res.json({ deleted: true });
  } catch (e) { next(e); }
});

export default brokerRouter;
