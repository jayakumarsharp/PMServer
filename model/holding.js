import mongoose from "mongoose";
const Portfolio = require("../model/portfolio");
const { NotFoundError } = require("../expressError");

const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  shares_owned: { type: Number, required: true },
  cost_basis: { type: Number, required: true },
  target_percentage: { type: Number, required: true },
  goal: { type: Number, required: true },
  portfolio_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Portfolio",
    required: true
  }
});

const Holding = mongoose.model("Holding", holdingSchema);



/** Create a holding, update db, return new holding data.
 *
 * data should be { symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
 *
 * Returns { id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
 *
 * Throws NotFoundError if portfolio doesn't exist
 * Throws BadRequestError if holding already exists in portfolio
 */

async function create(Obj) {
  try {
    const {
      symbol,
      shares_owned,
      cost_basis,
      target_percentage,
      goal,
      portfolio_id,
    } = Obj;

    // Check if portfolio exists
    const portfolio = await Portfolio.Portfolio.findOne({_id: portfolio_id});
    if (!portfolio)
      throw new NotFoundError(`Invalid portfolio: ${portfolio_id}`);

    // Check for duplicate holding
    const duplicateHolding = await Holding.findOne({ symbol, portfolio_id });
    if (duplicateHolding)
      throw new BadRequestError(`Duplicate holding: ${symbol}`);

    // Create new Holding
    const newHolding = await Holding.create({
      symbol,
      shares_owned,
      cost_basis,
      target_percentage,
      goal,
      portfolio_id
    });

    // Return created portfolio
    return newHolding;
  } catch (error) {
    throw error; // Re-throw the error for higher-level error handling
  }
}



 /** Given a holding id, return data about the holding 
   * 
   * Returns { id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
   * 
   * Throws NotFoundError if not found.
   */
async function get(id) {
  try {
    const exsistingHolding = Holding.findOne({ _id: id })
      .lean();
    if (!exsistingHolding) {
      throw new NotFoundError(`No portfolio: ${id}`);
    }
    return exsistingHolding;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching portfolio: ${error.message}`);
  }
  
}



export { create,get };
