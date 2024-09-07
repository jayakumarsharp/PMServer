import { PortfolioTransactions } from "../model/portfoliotransactions";
import { getbySymbol } from "../model/SecurityMaster";

// Create Holding
async function createHolding(Obj) {
  try {
    console.log("Obj.symbol" + Obj.symbol);
    const securitydata = await getbySymbol(Obj.symbol);
    console.log(securitydata);
    const symbol = securitydata._id;
    console.log("symbolsecurity_id", symbol);

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
      symbol,
      shares_owned,
      cost_basis,
      tran_code,
      executed_price,
      target_percentage,
      goal,
      portfolio_id,
    });

    return newHolding;
  } catch (error) {
    console.error("Error creating holding:", error);
    return { success: false, errors: [error.message] };
  }

}
async function getHoldingbypfandsecurity(obj) {
  try {

    const transactions = PortfolioTransactions.find({
      portfolio_id: obj.portfolioid,
      symbol: obj.secid,
      tran_code: { $in: ["by", "sl"] },
    });
    return transactions;
  } catch (error) {
    console.error("Error creating holding:", error);
    return { success: false, errors: [error.message] };
  }
}

export { createHolding, getHoldingbypfandsecurity };
