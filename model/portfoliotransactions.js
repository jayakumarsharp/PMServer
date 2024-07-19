import mongoose from "mongoose";
import { getbySymbol } from "../model/SecurityMaster";

const portfolioTransactionsschema = new mongoose.Schema({
  symbol: {
    type: mongoose.Schema.ObjectId,
    ref: "SecurityMaster",
  },
  shares_owned: { type: Number },
  cost_basis: { type: Number },
  tran_code: { type: String },
  executed_price: { type: Number },
  target_percentage: { type: Number },
  goal: { type: Number },
  portfolio_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Portfolio",
  },
});

const PortfolioTransactions = mongoose.model(
  "PortfolioTransactions",
  portfolioTransactionsschema
);

//Create Holding
async function createHolding(Obj) {
  try {
    console.log("Obj.symbol" + Obj.symbol);
    const securitydata = await getbySymbol(Obj.symbol);
    console.log(securitydata);
    const security_id = securitydata._id;

    const {
      shares_owned,
      cost_basis,
      tran_code,
      executed_price,
      target_percentage,
      goal,
      portfolio_id,
    } = Obj;

    

    // Create new Holding
    const newHolding = await PortfolioTransactions.create({
      security_id,
      shares_owned,
      cost_basis,
      tran_code,
      executed_price,
      target_percentage,
      goal,
      portfolio_id,
    });

    return newHolding;

    // Return created portfolio
  } catch (error) {
    throw error; // Re-throw the error for higher-level error handling
  }
}
export { PortfolioTransactions, createHolding };