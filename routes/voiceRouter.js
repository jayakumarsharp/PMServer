import express from "express";
import { ensureLoggedIn } from "../middleware/auth";
import { parseVoiceCommand } from "../services/voiceService";
import { validate, voiceParseSchema } from "../validations/schemas";
import { createHolding } from "../services/PortfolioTransactionService";
import { PriceData } from "../model/Pricedata";
import { securityMaster } from "../model/SecurityMaster";

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

/**
 * POST /api/voice/confirm
 * Body: { text, portfolio_id, broker_id? }
 * Parses the voice command and, if confidence is high enough, creates a transaction.
 * If price was not spoken, uses the last known market price.
 */
voiceRouter.post("/confirm", ensureLoggedIn, async (req, res, next) => {
  try {
    const { text, portfolio_id, broker_id } = req.body;
    if (!text) return res.status(400).json({ error: "text is required" });
    if (!portfolio_id) return res.status(400).json({ error: "portfolio_id is required" });

    const parsed = await parseVoiceCommand(text);

    // Must have at minimum action + quantity + resolved symbol
    if (!parsed.ready) {
      return res.status(422).json({
        error: "Voice command could not be fully parsed",
        parsed,
      });
    }

    let executedPrice = parsed.price;

    // If no price was spoken, use the last known market price
    if (!executedPrice) {
      const sec = await securityMaster.findOne({ symbol: parsed.symbol }).lean();
      if (sec) {
        const priceData = await PriceData.findOne({ securityMaster_id: sec._id })
          .select("regularMarketPrice")
          .lean();
        executedPrice = priceData?.regularMarketPrice || 0;
      }
    }

    if (!executedPrice) {
      return res.status(422).json({
        error: "Could not determine price. Please say the price (e.g. 'at 2850') or add market data first.",
        parsed,
      });
    }

    const holding = await createHolding({
      symbol: parsed.symbol,
      shares_owned: parsed.quantity,
      executed_price: executedPrice,
      tran_code: parsed.action,
      portfolio_id,
      broker_id: broker_id || undefined,
      createdBy: req.user?.username || "voice",
    });

    return res.status(201).json({
      transaction: holding,
      parsed,
      message: `${parsed.action === "by" ? "Bought" : "Sold"} ${parsed.quantity} shares of ${parsed.symbol} at ${executedPrice}`,
    });
  } catch (err) {
    return next(err);
  }
});

export default voiceRouter;
