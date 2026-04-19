const express = require("express");
const portfoliotransactionsRouter = express.Router();
const { createHolding, getHoldingbypfandsecurity } = require("../services/PortfolioTransactionService");
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


module.exports = portfoliotransactionsRouter;
