import Dividend from "../model/Dividend";
import { securityMaster } from "../model/SecurityMaster";

async function recordDividend({ portfolio_id, symbol, amount_per_share, shares_held, currency, ex_date, pay_date, notes }) {
  const sec = await securityMaster.findOne({ symbol: symbol.toUpperCase() }).lean();
  if (!sec) throw new Error(`Security not found: ${symbol}`);

  const div = await Dividend.create({
    portfolio_id,
    security_id: sec._id,
    amount_per_share,
    shares_held,
    currency: currency || "INR",
    ex_date: new Date(ex_date),
    pay_date: pay_date ? new Date(pay_date) : undefined,
    notes,
  });
  return div;
}

async function getDividends(portfolioId) {
  const divs = await Dividend.find({ portfolio_id: portfolioId })
    .populate("security_id", "symbol longname")
    .sort({ ex_date: -1 })
    .lean();

  return divs.map((d) => ({
    _id: d._id,
    symbol: d.security_id?.symbol,
    symbolName: d.security_id?.longname,
    amount_per_share: d.amount_per_share,
    shares_held: d.shares_held,
    total_amount: d.total_amount,
    currency: d.currency,
    ex_date: d.ex_date,
    pay_date: d.pay_date,
    notes: d.notes,
    createdAt: d.createdAt,
  }));
}

async function getDividendSummary(portfolioId) {
  const divs = await Dividend.find({ portfolio_id: portfolioId })
    .populate("security_id", "symbol longname")
    .lean();

  const bySecurity = {};
  let grandTotal = 0;

  for (const d of divs) {
    const sym = d.security_id?.symbol || "UNKNOWN";
    if (!bySecurity[sym]) {
      bySecurity[sym] = {
        symbol: sym,
        symbolName: d.security_id?.longname,
        currency: d.currency,
        total_dividends: 0,
        payment_count: 0,
      };
    }
    bySecurity[sym].total_dividends += d.total_amount || 0;
    bySecurity[sym].payment_count += 1;
    grandTotal += d.total_amount || 0;
  }

  return {
    by_security: Object.values(bySecurity).sort((a, b) => b.total_dividends - a.total_dividends),
    grand_total: +grandTotal.toFixed(4),
    payment_count: divs.length,
  };
}

async function deleteDividend(id) {
  const deleted = await Dividend.findByIdAndDelete(id);
  if (!deleted) throw new Error(`Dividend not found: ${id}`);
  return deleted;
}

export { recordDividend, getDividends, getDividendSummary, deleteDividend };
