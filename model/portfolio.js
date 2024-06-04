import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cash: { type: Number, required: true },
  notes: String,
  username: { type: String, required: true },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);



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

export { registerPortfolio};
