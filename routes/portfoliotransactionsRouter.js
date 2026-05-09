const express = require("express");
const portfoliotransactionsRouter = express.Router();
const { createHolding, getHoldingbypfandsecurity, getDCASummary, getProfitSignals, getRealizedUnrealizedPnL, getXIRR } = require("../services/PortfolioTransactionService");
const { validate, createTransactionSchema } = require("../validations/schemas");


portfoliotransactionsRouter.post(
  "/createTransaction",
  validate(createTransactionSchema),
  async function (req, res, next) {
    try {
      console.log(req.body);
      const holding = await createHolding(req.body);
      return res.status(201).json(holding);
    } catch (err) {
      return next(err);
    }
  }
);


portfoliotransactionsRouter.post(
  "/getHoldingbypfandsecurity",
  async function (req, res, next) {
    try {
      console.log(req.body);
      const transactions = await getHoldingbypfandsecurity(req.body);
      return res.status(201).json(transactions);
    } catch (err) {
      return next(err);
    }
  }
);


// GET /dca-summary/:portfolioId/:securityId
// Returns DCA breakdown: avg cost, break-even (incl. commissions), lots, current P&L
portfoliotransactionsRouter.get(
  "/dca-summary/:portfolioId/:securityId",
  async function (req, res, next) {
    try {
      const summary = await getDCASummary(req.params.portfolioId, req.params.securityId);
      return res.json(summary);
    } catch (err) {
      return next(err);
    }
  }
);

// GET /signals/:portfolioId
// Returns holdings that have hit their profit target — "time to sell" alerts
portfoliotransactionsRouter.get(
  "/signals/:portfolioId",
  async function (req, res, next) {
    try {
      const signals = await getProfitSignals(req.params.portfolioId);
      return res.json(signals);
    } catch (err) {
      return next(err);
    }
  }
);

// GET /realized-unrealized/:portfolioId
// Returns FIFO-matched realized P&L vs open unrealized positions
portfoliotransactionsRouter.get(
  "/realized-unrealized/:portfolioId",
  async function (req, res, next) {
    try {
      const result = await getRealizedUnrealizedPnL(req.params.portfolioId);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }
);

// GET /xirr/:portfolioId
// Returns XIRR (true annualized return) for the portfolio
portfoliotransactionsRouter.get(
  "/xirr/:portfolioId",
  async function (req, res, next) {
    try {
      const result = await getXIRR(req.params.portfolioId);
      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = portfoliotransactionsRouter;
