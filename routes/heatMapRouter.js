const express = require("express");
const heatMapRouter = express.Router();
import { getpricelistbySymbol } from "../services/pricehistoryservice";
import { getATHpricelistbySymbol } from "../services/ATHCutterService";

heatMapRouter.post(
  "/getpricehistoryforsecurity",
  async function (req, res, next) {
    try {
      console.log(req.body);
      const pricehistory = await getpricelistbySymbol(req.body);
      return res.json(pricehistory);
    } catch (err) {
      return next(err);
    }
  }
);



heatMapRouter.post(
  "/getATHpricelistbySymbol",
  async function (req, res, next) {
    try {
      console.log(req.body);
      const pricehistory = await getATHpricelistbySymbol(req.body);
      return res.json(pricehistory);
    } catch (err) {
      return next(err);
    }
  }
);
module.exports = heatMapRouter;
