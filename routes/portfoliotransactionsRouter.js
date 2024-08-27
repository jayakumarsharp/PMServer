const express = require("express");
const portfoliotransactionsRouter = express.Router();
import { createHolding, getHoldingbypfandsecurity } from "../services/PortfolioTransactionService";

/** POST / { holding } => { holding }
 *
 * holding should be { symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
 *
 * Returns { id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
 *
 * Authorization required: logged in user
 */

portfoliotransactionsRouter.post(
  "/createTransaction",
  async function (req, res, next) {
    try {
      console.log(req.body);
      const holding = await createHolding(req.body);
      return res.status(201).json({ holding });
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
      return res.status(201).json({ transactions });
    } catch (err) {
      return next(err);
    }
  }
);






module.exports = portfoliotransactionsRouter;
