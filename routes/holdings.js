const express = require("express");
const holdingRouter = express.Router();
import {  Holding,create, get, remove} from "../model/holding";
const portfolioModel = require("../model/portfolio");
const securityModel = require("../model/SecurityMaster");

const jsonschema = require("jsonschema");

holdingRouter.get("/:id", async function (req, res, next) {
  try {
    const existingholding = await get(req.params.id);
    return res.json({ existingholding });
  } catch (err) {
    return next(err);
  }
});

module.exports = holdingRouter;
