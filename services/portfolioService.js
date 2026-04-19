import { getbyUserId } from "./userService";
import { Portfolio } from "../model/portfolio";
async function registerPortfolio(Obj) {
  try {
    const { name, notes, user_id } = Obj;

    
    // Check for duplicate portfolio name
    const duplicatePortfolio = await Portfolio.findOne({
      name: name,
      user_id: user_id,
    });
    if (duplicatePortfolio) throw new Error(`Duplicate Portfolio: ${name}`);
    // Create new portfolio
    const newPortfolio = await Portfolio.create({
      name,
      notes,
      user_id,
    });

    // Return created portfolio
    return {
      _id: newPortfolio._id,
      name: newPortfolio.name,
      notes: newPortfolio.notes,
    };
  } catch (error) {
    throw error; // Re-throw the error for higher-level error handling
  }
}

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

async function remove(id) {
  const deletedPortfolio = await Portfolio.findByIdAndDelete(id);

  if (!deletedPortfolio) {
    throw new NotFoundError(`No portfolio: ${id}`);
  }

  return deletedPortfolio.toObject();
}

export { registerPortfolio, get, updatePortfolio, remove, getbyId };
