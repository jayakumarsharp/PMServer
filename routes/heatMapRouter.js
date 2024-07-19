const express = require("express");
const heatMapRouter = express.Router();
import { getpricelistbySymbol } from "../model/pricehistories";

heatMapRouter.post(
  "/getpricehistoryforsecurity",
  async function (req, res, next) {
    try {
      console.log(req.body);
      const pricehistory = await getpricelistbySymbol(req.body.name);
      return res.json(pricehistory);
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = heatMapRouter;
