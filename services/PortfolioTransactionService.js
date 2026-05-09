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

/**
 * FIFO lot matching to separate realized vs unrealized P&L.
 * Returns realized gains (closed positions) and unrealized (open lots).
 */
async function getRealizedUnrealizedPnL(portfolioId) {
  const transactions = await PortfolioTransactions.find({
    portfolio_id: portfolioId,
    tran_code: { $in: ["by", "sl"] },
  })
    .populate("symbol", "symbol longname")
    .sort({ createdAt: 1 })
    .lean();

  // Group transactions per security
  const bySymbol = {};
  for (const t of transactions) {
    const sid = String(t.symbol._id);
    if (!bySymbol[sid]) bySymbol[sid] = { symbol: t.symbol, buys: [], sells: [] };
    if (t.tran_code === "by") bySymbol[sid].buys.push({ ...t });
    else bySymbol[sid].sells.push({ ...t });
  }

  const results = [];

  for (const [sid, { symbol, buys, sells }] of Object.entries(bySymbol)) {
    // FIFO: work through buy lots, matching against sells
    const buyQueue = buys.map(b => ({
      date: b.createdAt,
      shares: b.shares_owned,
      price: b.executed_price,
      commission: b.commission || 0,
      currency: b.currency || "INR",
    }));

    let realized_pnl = 0;
    let realized_commissions = 0;
    let realized_shares = 0;

    for (const sell of sells) {
      let remainingToSell = sell.shares_owned;
      const sellCommission = sell.commission || 0;

      while (remainingToSell > 0 && buyQueue.length > 0) {
        const lot = buyQueue[0];
        const matched = Math.min(lot.shares, remainingToSell);
        const cost = matched * lot.price;
        const proceeds = matched * sell.executed_price;
        const lotCommission = (matched / (lot.shares + matched)) * lot.commission;

        realized_pnl += proceeds - cost;
        realized_commissions += lotCommission + (matched / sell.shares_owned) * sellCommission;
        realized_shares += matched;

        lot.shares -= matched;
        remainingToSell -= matched;
        if (lot.shares <= 0) buyQueue.shift();
      }
    }

    // Remaining buy lots = unrealized
    let unrealized_shares = 0;
    let unrealized_cost = 0;
    let unrealized_commissions = 0;
    for (const lot of buyQueue) {
      unrealized_shares += lot.shares;
      unrealized_cost += lot.shares * lot.price;
      unrealized_commissions += lot.commission;
    }

    const priceData = await PriceData.findOne({ securityMaster_id: sid })
      .select("regularMarketPrice")
      .lean();
    const current_price = priceData?.regularMarketPrice || 0;
    const unrealized_value = unrealized_shares * current_price;
    const unrealized_pnl = unrealized_value - unrealized_cost;
    const net_realized = realized_pnl - realized_commissions;
    const net_unrealized = unrealized_pnl - unrealized_commissions;

    results.push({
      symbol: symbol.symbol,
      symbolName: symbol.longname,
      secid: sid,
      realized: {
        shares_sold: realized_shares,
        pnl: +realized_pnl.toFixed(4),
        commissions: +realized_commissions.toFixed(4),
        net_pnl: +net_realized.toFixed(4),
      },
      unrealized: {
        shares_held: unrealized_shares,
        cost_basis: +unrealized_cost.toFixed(4),
        current_value: +unrealized_value.toFixed(4),
        current_price,
        pnl: +unrealized_pnl.toFixed(4),
        commissions: +unrealized_commissions.toFixed(4),
        net_pnl: +net_unrealized.toFixed(4),
        pnl_percent: unrealized_cost > 0
          ? +((net_unrealized / unrealized_cost) * 100).toFixed(2)
          : 0,
      },
    });
  }

  const totals = results.reduce(
    (acc, r) => {
      acc.realized_net_pnl += r.realized.net_pnl;
      acc.unrealized_net_pnl += r.unrealized.net_pnl;
      acc.total_cost_basis += r.unrealized.cost_basis;
      acc.total_current_value += r.unrealized.current_value;
      return acc;
    },
    { realized_net_pnl: 0, unrealized_net_pnl: 0, total_cost_basis: 0, total_current_value: 0 }
  );

  return {
    holdings: results,
    totals: {
      realized_net_pnl: +totals.realized_net_pnl.toFixed(4),
      unrealized_net_pnl: +totals.unrealized_net_pnl.toFixed(4),
      combined_net_pnl: +(totals.realized_net_pnl + totals.unrealized_net_pnl).toFixed(4),
      total_cost_basis: +totals.total_cost_basis.toFixed(4),
      total_current_value: +totals.total_current_value.toFixed(4),
    },
  };
}

/**
 * XIRR — Extended Internal Rate of Return using Newton-Raphson iteration.
 * Accounts for timing of each cash flow, giving a true annualized return.
 *
 * @param {string} portfolioId
 * @returns {{ xirr: number|null, xirrPercent: string }}
 */
async function getXIRR(portfolioId) {
  const transactions = await PortfolioTransactions.find({
    portfolio_id: portfolioId,
    tran_code: { $in: ["by", "sl"] },
  })
    .populate("symbol", "symbol")
    .sort({ createdAt: 1 })
    .lean();

  if (!transactions.length) return { xirr: null, xirrPercent: "N/A", cashflows: [] };

  // Cash flows: buys are negative (money out), sells are positive (money in)
  const cashflows = transactions.map(t => ({
    date: new Date(t.createdAt),
    amount: t.tran_code === "by"
      ? -((t.shares_owned * t.executed_price) + (t.commission || 0))
      : (t.shares_owned * t.executed_price) - (t.commission || 0),
  }));

  // Add today's market value of remaining open positions as a final inflow
  const posMap = {};
  for (const t of transactions) {
    const sid = String(t.symbol._id);
    if (!posMap[sid]) posMap[sid] = { shares: 0, secid: t.symbol._id };
    if (t.tran_code === "by") posMap[sid].shares += t.shares_owned;
    else posMap[sid].shares -= t.shares_owned;
  }

  let openValue = 0;
  for (const pos of Object.values(posMap)) {
    if (pos.shares > 0) {
      const p = await PriceData.findOne({ securityMaster_id: pos.secid })
        .select("regularMarketPrice")
        .lean();
      openValue += pos.shares * (p?.regularMarketPrice || 0);
    }
  }

  if (openValue > 0) {
    cashflows.push({ date: new Date(), amount: openValue });
  }

  const rate = _calcXIRR(cashflows);

  return {
    xirr: rate !== null ? +rate.toFixed(6) : null,
    xirrPercent: rate !== null ? `${(rate * 100).toFixed(2)}%` : "N/A",
    cashflows: cashflows.map(cf => ({
      date: cf.date.toISOString().split("T")[0],
      amount: +cf.amount.toFixed(2),
    })),
  };
}

function _calcXIRR(cashflows, guess = 0.1, maxIter = 1000, tol = 1e-7) {
  if (cashflows.length < 2) return null;
  const t0 = cashflows[0].date.getTime();
  const years = cashflows.map(cf => (cf.date.getTime() - t0) / (365.25 * 24 * 3600 * 1000));

  let r = guess;
  for (let i = 0; i < maxIter; i++) {
    let f = 0;
    let df = 0;
    for (let j = 0; j < cashflows.length; j++) {
      const denom = Math.pow(1 + r, years[j]);
      f += cashflows[j].amount / denom;
      df -= years[j] * cashflows[j].amount / (denom * (1 + r));
    }
    if (Math.abs(df) < 1e-12) break;
    const rNew = r - f / df;
    if (Math.abs(rNew - r) < tol) return rNew;
    r = rNew;
  }
  return r;
}

export { createHolding, getHoldingbypfandsecurity, getDCASummary, getProfitSignals, getRealizedUnrealizedPnL, getXIRR };
