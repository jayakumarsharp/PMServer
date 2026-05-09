import express from "express";
import { ensureLoggedIn } from "../middleware/auth";
import { recordDividend, getDividends, getDividendSummary, deleteDividend } from "../services/dividendService";

const dividendRouter = express.Router();

// POST /api/dividends — record a dividend payment
dividendRouter.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const { portfolio_id, symbol, amount_per_share, shares_held, currency, ex_date, pay_date, notes } = req.body;
    if (!portfolio_id || !symbol || !amount_per_share || !shares_held || !ex_date) {
      return res.status(400).json({ error: "portfolio_id, symbol, amount_per_share, shares_held, and ex_date are required" });
    }
    const div = await recordDividend({ portfolio_id, symbol, amount_per_share, shares_held, currency, ex_date, pay_date, notes });
    return res.status(201).json(div);
  } catch (err) {
    return next(err);
  }
});

// GET /api/dividends/:portfolioId — list dividends for a portfolio
dividendRouter.get("/:portfolioId", ensureLoggedIn, async (req, res, next) => {
  try {
    const divs = await getDividends(req.params.portfolioId);
    return res.json(divs);
  } catch (err) {
    return next(err);
  }
});

// GET /api/dividends/:portfolioId/summary — totals by security
dividendRouter.get("/:portfolioId/summary", ensureLoggedIn, async (req, res, next) => {
  try {
    const summary = await getDividendSummary(req.params.portfolioId);
    return res.json(summary);
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/dividends/:id — remove a dividend record
dividendRouter.delete("/:id", ensureLoggedIn, async (req, res, next) => {
  try {
    await deleteDividend(req.params.id);
    return res.json({ msg: "Dividend deleted" });
  } catch (err) {
    return next(err);
  }
});

export default dividendRouter;
