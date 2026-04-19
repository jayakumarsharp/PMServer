import express from "express";
import { ensureLoggedIn } from "../middleware/auth";
import { analyzePortfolio, saveApiKey, getSettings, updateSettings } from "../services/claudeService";

const router = express.Router();

// GET /api/ai/settings — get user's AI settings (masked key)
router.get("/settings", ensureLoggedIn, async (req, res, next) => {
  try {
    const data = await getSettings(req.user._id || req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// POST /api/ai/settings — save Claude API key and preferences
router.post("/settings", ensureLoggedIn, async (req, res, next) => {
  try {
    const { claudeApiKey, defaultCurrency } = req.body;
    const userId = req.user._id || req.user.id;
    const results = {};
    if (claudeApiKey !== undefined) {
      Object.assign(results, await saveApiKey(userId, claudeApiKey));
    }
    if (defaultCurrency) {
      Object.assign(results, await updateSettings(userId, { defaultCurrency }));
    }
    res.json(results);
  } catch (e) {
    next(e);
  }
});

// POST /api/ai/analyze — send a message and get Claude's analysis
router.post("/analyze", ensureLoggedIn, async (req, res, next) => {
  try {
    const { message, analysisType, chatHistory } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }
    const userId = req.user._id || req.user.id;
    const response = await analyzePortfolio({
      userId,
      userMessage: message.trim(),
      analysisType: analysisType || "general",
      chatHistory: Array.isArray(chatHistory) ? chatHistory : [],
    });
    res.json({ response });
  } catch (e) {
    next(e);
  }
});

export default router;
