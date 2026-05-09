const express = require("express");
const portfolioRouter = express.Router();
const portfolio = require("../services/portfolioService");
const { validate, createPortfolioSchema, updatePortfolioSchema } = require("../validations/schemas");
const { ensureLoggedIn } = require("../middleware/auth");

portfolioRouter.get("/:name", async function (req, res, next) {
  try {
    const existingPortfolio = await portfolio.get(req.params.name);
    return res.json({ existingPortfolio });
  } catch (err) {
    return next(err);
  }
});

portfolioRouter.post("/createPortfolio", validate(createPortfolioSchema), async (req, res, next) => {
  try {
    console.log(req.body);
    const createdPortfolio = await portfolio.registerPortfolio(req.body);
    res.status(201).json(createdPortfolio);
  } catch (err) {
    next(err);
  }
});

portfolioRouter.patch("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    console.log(id);
    const portfolioUpdated = await portfolio.updatePortfolio(id, req.body);
    return res.json({ portfolioUpdated });
  } catch (err) {
    return next(err);
  }
});

portfolioRouter.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const portfolioDeleted = await portfolio.remove(id);
    res.status(201).json(portfolioDeleted);
  } catch (err) {
    return next(err);
  }
});

// GET /api/portfolio/networth?currency=INR
// Consolidated net worth across all portfolios in base currency
portfolioRouter.get("/networth", async function (req, res, next) {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) return res.status(400).json({ error: "userId required" });
    const baseCurrency = (req.query.currency || "INR").toUpperCase();
    const result = await portfolio.getConsolidatedNetWorth(userId, baseCurrency);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

// PATCH /api/portfolio/:id/cash — update cash balance
portfolioRouter.patch("/:id/cash", async function (req, res, next) {
  try {
    const { cash_balance, currency } = req.body;
    const { Portfolio } = require("../model/portfolio");
    const updated = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: { cash_balance: Number(cash_balance), ...(currency && { currency: currency.toUpperCase() }) } },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: "Portfolio not found" });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
});

export default portfolioRouter;
