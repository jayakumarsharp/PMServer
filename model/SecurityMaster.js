import mongoose from "mongoose";

const securityMasterSchema = new mongoose.Schema({
  exchange: String,
  shortname: String,
  quoteType: String,
  symbol: String,
  index: String,
  score: Number,
  typeDisp: String,
  longname: String,
  exchDisp: String,
  sector: String,
  sectorDisp: String,
  industry: String,
  industryDisp: String,
  isYahooFinance: Boolean,
});

const securityMaster = mongoose.model("SecurityMaster", securityMasterSchema);

async function getbySymbol(searchsymbol) {
  try {
    const exsistingHolding = securityMaster
      .findOne({ symbol: searchsymbol })
      .lean();
    if (!exsistingHolding) {
      throw new NotFoundError(`No securityMaster: ${searchsymbol}`);
    }
    return exsistingHolding;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching securityMaster: ${error.message}`);
  }
}

async function findBysecIdAndUpdate(id, newData) {
  try {
    const updatedSecurity = await securityModel.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (!updatedSecurity) {
      throw new Error("Security not found");
    }
    return updatedSecurity;
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching securityMaster: ${error.message}`);
  }
}

export { securityMaster, getbySymbol, findBysecIdAndUpdate };
