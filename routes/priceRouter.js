import express from "express";
import yahooFinance from "yahoo-finance2";
const { getPriceCache } = require("../lib/cache");

const priceapiRouter = express.Router();
const cache = getPriceCache();

priceapiRouter.get("/getPrice/:security", async (req, res, next) => {
  try {
    const { security } = req.params;
    const cacheKey = `price:${security}`;

    const cached = cache.get(cacheKey);
    if (cached) return res.json({ source: "cache", ...cached });

    const quote = await yahooFinance.quote(security, {}, { validateResult: false });
    const data = {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChange,
      changePercent: quote.regularMarketChangePercent,
      currency: quote.currency,
      marketState: quote.marketState,
    };
    cache.set(cacheKey, data);
    return res.json({ source: "live", ...data });
  } catch (err) {
    next(err);
  }
});

export default priceapiRouter;
