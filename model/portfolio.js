import mongoose from "mongoose";
import { getbyUsername } from "../model/user";

const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cash: { type: Number, required: true },
  notes: String,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
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

    var userdata = await getbyUsername(username);
    const user_id = userdata._id;
    console.log("user id", user_id);
    // Check for duplicate portfolio name
    const duplicatePortfolio = await Portfolio.findOne({
      name: name,
      user_id: user_id,
    });
    if (duplicatePortfolio) throw new Error(`Duplicate Portfolio: ${name}`);

    // Create new portfolio
    const newPortfolio = await Portfolio.create({
      name,
      cash,
      notes,
      user_id,
    });

    // Return created portfolio
    return {
      _id: newPortfolio._id,
      name: newPortfolio.name,
      cash: newPortfolio.cash,
      notes: newPortfolio.notes,
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
    const exsistingPortfolio = Portfolio.findOne({ name }).lean();
    if (!exsistingPortfolio) {
      throw new NotFoundError(`No portfolio: ${name}`);
    }
    return exsistingPortfolio;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching portfolio: ${error.message}`);
  }
}

async function getbyId(id) {
  try {
    const exsistingPortfolio = Portfolio.findOne({
      _id: new mongoose.Types.ObjectId(id),
    }).lean();
    if (!exsistingPortfolio) {
      throw new NotFoundError(`No portfolio: ${id}`);
    }
    return exsistingPortfolio;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching portfolio: ${error.message}`);
  }
}

/**
 * Update portfolio data with `data`.
 *
 * This is a "partial update" --- it's fine if data doesn't contain all the
 * fields; this only changes provided ones.
 *
 * Data can include: { name, cash, notes }
 *
 * Returns { id, name, cash, notes, username }
 *
 * Throws NotFoundError if not found.
 */
async function updatePortfolio(id, newPortfolio) {
  console.log(newPortfolio);

  const updatedPortfolio = await Portfolio.findByIdAndUpdate(
    { _id: id },
    newPortfolio,
    { new: true, runValidators: true }
  );
  if (!updatedPortfolio) {
    throw new NotFoundError(`No portfolio: ${newPortfolio.name}`);
  }

  return updatedPortfolio.toObject();
}

/** Delete given portfolio from datbase; returns undefined.
 *
 * Throws NotFoundError if portfolio not found.
 */
async function remove(id) {
  const deletedPortfolio = await Portfolio.findByIdAndDelete(id);

  if (!deletedPortfolio) {
    throw new NotFoundError(`No portfolio: ${id}`);
  }

  return deletedPortfolio.toObject();
}

export { Portfolio, registerPortfolio, get, updatePortfolio, remove, getbyId };
