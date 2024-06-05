const express = require("express");
const portfolioRouter = express.Router();
const portfolio = require("../model/portfolio");






/** GET /[id] => { portfolio }
 * 
 * Returns { id, name, cash, notes, username, holdings }
 *   where where holdings is [{ id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }, ...]
 * 
 * Authorization required: user must own portfolio
*/

portfolioRouter.get("/:name", async function (req, res, next) {
  try {
    const existingPortfolio = await portfolio.get(req.params.name)
    return res.json({ existingPortfolio });
  } catch (err) {
    return next(err);
  }
});


/**
 * POST /createPortfolio
 *
 * Creates a new portfolio.
 *
 * Request body should contain:
 * {
 *    "name": "portfolio_name",
 *    "cash": 10000,
 *    "notes": "optional_notes",
 *    "username": "user_associated_with_portfolio"
 * }
 *
 * Returns:
 * {
 *    "id": "portfolio_id",
 *    "name": "portfolio_name",
 *    "cash": 10000,
 *    "notes": "optional_notes",
 *    "username": "user_associated_with_portfolio"
 * }
 *
 * Authorization required: logged in user
 */
portfolioRouter.post("/createPortfolio", async (req, res, next) => {
  try {
    const { name, cash, notes, username } = req.body;
    const newPortfolio = { name, cash, notes, username };
    const createdPortfolio = await portfolio.registerPortfolio(newPortfolio);
    res.status(201).json(createdPortfolio);
  } catch (err) {
    next(err);
  }
});


 

export default portfolioRouter;
