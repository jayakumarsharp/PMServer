import { PortfolioTransactions } from "../model/portfoliotransactions";
import { getbySymbol } from "../model/SecurityMaster";
import Broker from "../model/Broker";
import { PriceData } from "../model/Pricedata";

async function createHolding(Obj) {
  const securitydata = await getbySymbol(Obj.symbol);
  const symbol = securitydata._id;

  const {
    shares_owned,
    cost_basis,
    tran_code,
    executed_price,
    target_percentage,
    goal,
    portfolio_id,
    broker_id,
    createdBy,
  } = Obj;

  let commission = 0;
  let currency = "INR";

  if (broker_id) {
    const broker = await Broker.findById(broker_id).lean();
    if (broker) {
      commission = tran_code === "sl" ? broker.sell_commission : broker.buy_commission;
      currency = broker.default_currency;
    }
  }

  const newHolding = await PortfolioTransactions.create({
    symbol,
    shares_owned,
    cost_basis,
    tran_code,
    executed_price,
    target_percentage,
    goal,
    portfolio_id,
    broker_id: broker_id || undefined,
    commission,
    currency,
    createdBy,
  });

  return newHolding;
}

async function getHoldingbypfandsecurity(obj) {
  const transactions = await PortfolioTransactions.find({
    portfolio_id: obj.portfolioid,
    symbol: obj.secid,
    tran_code: { $in: ["by", "sl"] },
  });
  return transactions;
}

// DCA summary for a security inside a portfolio.
// Shows average cost basis (incl. commissions), break-even price, current P&L.
async function getDCASummary(portfolioId, securityId) {
  const transactions = await PortfolioTransactions.find({
    portfolio_id: portfolioId,
    symbol: securityId,
    tran_code: { $in: ["by", "sl"] },
  }).lean();

  let total_shares = 0;
  let total_invested = 0;
  let total_commissions = 0;
  const lots = [];

  for (const t of transactions) {
    const lot_value = t.shares_owned * t.executed_price;
    total_commissions += t.commission || 0;

    if (t.tran_code === "by") {
      total_shares += t.shares_owned;
      total_invested += lot_value;
      lots.push({
        date: t.createdAt,
        shares: t.shares_owned,
        price: t.executed_price,
        commission: t.commission || 0,
        currency: t.currency || "INR",
      });
    } else {
      total_shares -= t.shares_owned;
      total_invested -= lot_value;
    }
  }

  const average_cost = total_shares > 0 ? total_invested / total_shares : 0;
  // Break-even = average cost + total commissions spread across remaining shares
  const break_even_price = total_shares > 0
    ? (total_invested + total_commissions) / total_shares
    : 0;

  const priceData = await PriceData.findOne({ securityMaster_id: securityId })
    .select("regularMarketPrice financialCurrency")
    .lean();

  const current_price = priceData ? priceData.regularMarketPrice : 0;
  const current_value = total_shares * current_price;
  const gross_pnl = current_value - total_invested;
  const net_pnl = gross_pnl - total_commissions;
  const net_pnl_percent = total_invested > 0 ? (net_pnl / total_invested) * 100 : 0;

  return {
    total_shares,
    total_invested,
    total_commissions,
    average_cost,
    break_even_price,
    current_price,
    current_value,
    gross_pnl,
    net_pnl,
    net_pnl_percent,
    lots,
    buy_count: lots.length,
  };
}

// Returns all holdings in a portfolio that have hit their profit target.
async function getProfitSignals(portfolioId) {
  const transactions = await PortfolioTransactions.find({
    portfolio_id: portfolioId,
    tran_code: { $in: ["by", "sl"] },
  })
    .populate("symbol")
    .lean();

  // Aggregate net position per security
  const holdings = {};
  for (const t of transactions) {
    const secId = String(t.symbol._id);
    if (!holdings[secId]) {
      holdings[secId] = {
        secid: t.symbol._id,
        symbol: t.symbol.symbol,
        total_shares: 0,
        total_invested: 0,
        total_commissions: 0,
        profit_target: null,
      };
    }
    const h = holdings[secId];
    const val = t.shares_owned * t.executed_price;
    h.total_commissions += t.commission || 0;

    if (t.tran_code === "by") {
      h.total_shares += t.shares_owned;
      h.total_invested += val;
      // Use the highest profit_target set across buy transactions
      if (t.target_percentage != null) {
        h.profit_target = h.profit_target == null
          ? t.target_percentage
          : Math.max(h.profit_target, t.target_percentage);
      }
    } else {
      h.total_shares -= t.shares_owned;
      h.total_invested -= val;
    }
  }

  const signals = [];
  for (const h of Object.values(holdings)) {
    if (h.total_shares <= 0 || h.profit_target == null) continue;

    const priceData = await PriceData.findOne({ securityMaster_id: h.secid })
      .select("regularMarketPrice")
      .lean();

    const current_price = priceData ? priceData.regularMarketPrice : 0;
    const current_value = h.total_shares * current_price;
    const net_pnl = current_value - h.total_invested - h.total_commissions;
    const net_pnl_percent = h.total_invested > 0
      ? (net_pnl / h.total_invested) * 100
      : 0;

    if (net_pnl_percent >= h.profit_target) {
      signals.push({
        symbol: h.symbol,
        secid: h.secid,
        total_shares: h.total_shares,
        total_invested: h.total_invested,
        total_commissions: h.total_commissions,
        current_price,
        current_value,
        net_pnl,
        net_pnl_percent: +net_pnl_percent.toFixed(2),
        profit_target: h.profit_target,
        signal: "SELL",
        message: `${h.symbol} has reached ${net_pnl_percent.toFixed(2)}% net return (target: ${h.profit_target}%). Consider selling.`,
      });
    }
  }

  return signals;
}

export { createHolding, getHoldingbypfandsecurity, getDCASummary, getProfitSignals };
