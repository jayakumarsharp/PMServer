import { getbyUserId } from "./userService";
import { Portfolio } from "../model/portfolio";
import { PortfolioTransactions } from "../model/portfoliotransactions";
import { PriceData } from "../model/Pricedata";
import ExchangeRate from "../model/ExchangeRate";
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

/**
 * Consolidated net worth across all portfolios for a user.
 * Converts all positions to a single base currency (default INR).
 * Includes cash balances and invested positions.
 */
async function getConsolidatedNetWorth(userId, baseCurrency = "INR") {
  const portfolios = await Portfolio.find({ user_id: userId }).lean();
  if (!portfolios.length) {
    return { portfolios: [], totals: { invested: 0, current_value: 0, cash: 0, net_worth: 0, pnl: 0, pnl_percent: 0, currency: baseCurrency } };
  }

  // Build an FX rate lookup: currency → rate to baseCurrency
  const fxRates = { [baseCurrency]: 1 };
  const fxDocs = await ExchangeRate.find({}).lean();
  for (const fx of fxDocs) {
    if (fx.targetCurrency === baseCurrency) fxRates[fx.baseCurrency] = fx.rate;
    if (fx.baseCurrency === baseCurrency) fxRates[fx.targetCurrency] = 1 / fx.rate;
  }
  const getFxRate = (currency) => fxRates[currency] || 1;

  const portfolioSummaries = [];
  let totalInvested = 0;
  let totalCurrentValue = 0;
  let totalCash = 0;

  for (const pf of portfolios) {
    const txns = await PortfolioTransactions.find({
      portfolio_id: pf._id,
      tran_code: { $in: ["by", "sl"] },
    }).lean();

    const posMap = {};
    for (const t of txns) {
      const sid = String(t.symbol);
      if (!posMap[sid]) posMap[sid] = { shares: 0, cost: 0, commissions: 0, currency: t.currency || pf.currency || baseCurrency };
      const val = t.shares_owned * t.executed_price;
      const comm = t.commission || 0;
      if (t.tran_code === "by") {
        posMap[sid].shares += t.shares_owned;
        posMap[sid].cost += val;
        posMap[sid].commissions += comm;
      } else {
        posMap[sid].shares -= t.shares_owned;
        posMap[sid].cost -= val;
        posMap[sid].commissions += comm;
      }
    }

    let pfInvested = 0;
    let pfCurrent = 0;

    for (const [sid, pos] of Object.entries(posMap)) {
      if (pos.shares <= 0) continue;
      const price = await PriceData.findOne({ securityMaster_id: sid })
        .select("regularMarketPrice financialCurrency")
        .lean();
      const posCurrency = price?.financialCurrency || pos.currency;
      const fxRate = getFxRate(posCurrency);
      const investedBase = pos.cost * fxRate;
      const currentBase = pos.shares * (price?.regularMarketPrice || 0) * fxRate;
      pfInvested += investedBase;
      pfCurrent += currentBase;
    }

    const pfCashCurrency = pf.currency || baseCurrency;
    const cashBase = (pf.cash_balance || 0) * getFxRate(pfCashCurrency);
    const pfPnl = pfCurrent - pfInvested;
    const pfPnlPct = pfInvested > 0 ? (pfPnl / pfInvested) * 100 : 0;

    portfolioSummaries.push({
      _id: pf._id,
      name: pf.name,
      notes: pf.notes,
      currency: pfCashCurrency,
      cash_balance: pf.cash_balance || 0,
      cash_balance_base: +cashBase.toFixed(2),
      invested: +pfInvested.toFixed(2),
      current_value: +pfCurrent.toFixed(2),
      pnl: +pfPnl.toFixed(2),
      pnl_percent: +pfPnlPct.toFixed(2),
      net_worth: +(pfCurrent + cashBase).toFixed(2),
    });

    totalInvested += pfInvested;
    totalCurrentValue += pfCurrent;
    totalCash += cashBase;
  }

  const totalPnl = totalCurrentValue - totalInvested;
  const totalPnlPct = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  return {
    portfolios: portfolioSummaries,
    totals: {
      invested: +totalInvested.toFixed(2),
      current_value: +totalCurrentValue.toFixed(2),
      cash: +totalCash.toFixed(2),
      net_worth: +(totalCurrentValue + totalCash).toFixed(2),
      pnl: +totalPnl.toFixed(2),
      pnl_percent: +totalPnlPct.toFixed(2),
      currency: baseCurrency,
    },
  };
}

export { registerPortfolio, get, updatePortfolio, remove, getbyId, getConsolidatedNetWorth };
