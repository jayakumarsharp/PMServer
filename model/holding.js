import mongoose from "mongoose";
import { portfolioTransactions } from "./portfoliotransactions";
const { NotFoundError } = require("../expressError");

/** Given a holding id, return data about the holding
 *
 * Returns { id, symbol, shares_owned, cost_basis, target_percentage, goal, portfolio_id }
 *
 * Throws NotFoundError if not found.
 */
async function getTransactions(id) {
  try {
    const holdings = await portfolioTransactions.aggregate([
      { $match: { portfolio_id: mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "securitymasters", // the name of the collection in MongoDB
          localField: "symbol",
          foreignField: "_id",
          as: "securityDetails",
        },
      },
      { $unwind: "$securityDetails" },
      {
        $group: {
          _id: "$symbol",
          securityDetails: { $first: "$securityDetails" },
        },
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id",
          totalShares: 1,
          securityDetails: 1,
        },
      },
    ]);

    if (!holdings) {
      throw new NotFoundError(`No portfolio: ${id}`);
    }
    return holdings;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching portfolio: ${error.message}`);
  }
}

export {  getTransactions };
