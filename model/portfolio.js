import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cash: { type: Number, required: true },
  notes: String,
  username: { type: String, required: true },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);


 /** Create a portfolio, update db, return new portfolio data.
   * 
   * data should be { name, cash, notes, username }
   * 
   * Returns { id, name, cash, notes, username }
   * 
   * Throws BadRequestError if portfolio already exists for user
   */
async function registerPortfolio(Obj) {
  try {
    const { name, cash, notes, username } = Obj;

    // Check for duplicate portfolio name
    const duplicatePortfolio = await Portfolio.findOne({ name });
    if (duplicatePortfolio)
      throw new Error(`Duplicate Portfolio: ${name}`);

    // Create new portfolio
    const newPortfolio = await Portfolio.create({
      name,
      cash,
      notes,
      username,
    });

    // Return created portfolio
    return {
      _id: newPortfolio._id,
      name: newPortfolio.name,
      cash: newPortfolio.cash,
      notes: newPortfolio.notes,
      username: newPortfolio.username,
    };
  } catch (error) {
    throw error; // Re-throw the error for higher-level error handling
  }
}


/** Given a portfolio id, return data about portfolio
   * 
   * Returns { id, name, cash, notes, username, holdings }
   *   where holdings is [{ id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }, ...]
   * 
   * Throws NotFoundError if not found.
   */
async function get(name) {
  try {
    const exsistingPortfolio = Portfolio.findOne({ name })
      .lean();
    if (!exsistingPortfolio) {
      throw new NotFoundError(`No portfolio: ${name}`);
    }
    return exsistingPortfolio;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching portfolio: ${error.message}`);
  }
}

export { Portfolio,registerPortfolio,get};
