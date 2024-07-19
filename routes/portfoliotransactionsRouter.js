const express = require("express");
const portfoliotransactionsRouter = express.Router();
import { createHolding } from "../model/portfoliotransactions";
const securityModel = require("../model/SecurityMaster");

const jsonschema = require("jsonschema");

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
      debugger;

      // const newTransaction = new portfolioTransactionsSchema({
      //   symbol: req.body.symbol,
      //   shares_owned: req.body.shares_owned,
      //   executed_price: req.body.executed_price,
      //   // target_percentage: 20,
      //   // goal: 20000,
      //   portfolio_id: req.body.portfolio_id, // Example ObjectId of a portfolio document
      // });

      const holding = await createHolding(req.body);
      return res.status(201).json({ holding });
    } catch (err) {
      return next(err);
    }
  }
);

// export default portfolioRouter;

module.exports = portfoliotransactionsRouter;
