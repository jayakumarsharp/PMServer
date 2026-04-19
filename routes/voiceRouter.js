import express from "express";
import { ensureLoggedIn } from "../middleware/auth";
import { parseVoiceCommand } from "../services/voiceService";
import { validate, voiceParseSchema } from "../validations/schemas";

const voiceRouter = express.Router();

/**
 * POST /api/voice/parse
 * Body: { text: "buy 50 reliance at 2850" }
 * Returns parsed intent: action, quantity, symbol, price, confidence, warnings
 */
voiceRouter.post("/parse", ensureLoggedIn, validate(voiceParseSchema), async (req, res, next) => {
  try {
    const result = await parseVoiceCommand(req.body.text);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

export default voiceRouter;
