import mongoose from "mongoose";


const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notes: String,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  cash_balance: { type: Number, default: 0 },
  currency: { type: String, uppercase: true, default: "INR" },
}, { timestamps: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

/** Create a portfolio, update db, return new portfolio data.
 *
 * data should be { name, cash, notes, username }
 *
 * Returns { id, name, cash, notes, username }
 *
 * Throws BadRequestError if portfolio already exists for user
 */


export { Portfolio  };
