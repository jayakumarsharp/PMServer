const express = require("express");
const portfolioRouter = express.Router();
const portfolio = require("../services/portfolioService");
const { validate, createPortfolioSchema, updatePortfolioSchema } = require("../validations/schemas");

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

export default portfolioRouter;
