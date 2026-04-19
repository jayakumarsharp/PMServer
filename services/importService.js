import fs from "fs";
import csvParser from "csv-parser";
import ImportMapping from "../model/ImportMapping";
import ImportHistory from "../model/ImportHistory";
import { securityMaster } from "../model/SecurityMaster";
import { PortfolioTransactions } from "../model/portfoliotransactions";

// ── Known broker column maps (built-in templates) ─────────────────────────────
const BROKER_TEMPLATES = {
  zerodha: {
    mappingName: "Zerodha Trade Book",
    brokerName: "Zerodha",
    columnMap: {
      symbol: "symbol",
      shares_owned: "quantity",
      executed_price: "price",
      tran_code: "trade_type",
      createdAt: "order_execution_time",
    },
    tranCodeMap: { buy: ["buy"], sell: ["sell"] },
    dateFormat: "YYYY-MM-DD HH:mm:ss",
  },
  upstox: {
    mappingName: "Upstox Trade History",
    brokerName: "Upstox",
    columnMap: {
      symbol: "Instrument",
      shares_owned: "Qty.",
      executed_price: "Avg. Price",
      tran_code: "Buy/Sell",
      createdAt: "Order Execution Time",
    },
    tranCodeMap: { buy: ["B", "BUY"], sell: ["S", "SELL"] },
    dateFormat: "DD-MM-YYYY HH:mm:ss",
  },
  groww: {
    mappingName: "Groww Portfolio Export",
    brokerName: "Groww",
    columnMap: {
      symbol: "Symbol",
      shares_owned: "Quantity",
      executed_price: "Price",
      tran_code: "Type",
      createdAt: "Date",
    },
    tranCodeMap: { buy: ["BUY", "Buy"], sell: ["SELL", "Sell"] },
    dateFormat: "DD MMM YYYY",
  },
  angel: {
    mappingName: "Angel Broking Trade History",
    brokerName: "Angel Broking",
    columnMap: {
      symbol: "Symbol",
      shares_owned: "Quantity",
      executed_price: "Net Rate",
      tran_code: "Trade Type",
      createdAt: "Trade Date",
    },
    tranCodeMap: { buy: ["B", "Buy"], sell: ["S", "Sell"] },
    dateFormat: "DD-MM-YYYY",
  },
};

// ── Fuzzy header matcher — finds the best CSV column for each PMS field ───────
function suggestMapping(headers) {
  const FIELD_ALIASES = {
    symbol: ["symbol", "scrip", "instrument", "stock", "ticker", "isin", "script name", "scrip name", "security", "name"],
    shares_owned: ["qty", "quantity", "shares", "units", "no of shares", "no. of shares", "qty."],
    executed_price: ["price", "rate", "avg price", "buy price", "net rate", "avg. price", "trade price"],
    tran_code: ["type", "trade type", "buy/sell", "transaction type", "order type", "side"],
    createdAt: ["date", "trade date", "order date", "time", "order execution time", "trade time"],
    cost_basis: ["amount", "value", "total", "net amount", "trade value"],
    portfolio_id: [],
  };

  const suggested = {};
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    for (const header of headers) {
      const h = header.toLowerCase().trim();
      if (aliases.some((a) => h.includes(a) || a.includes(h))) {
        suggested[field] = header;
        break;
      }
    }
  }
  return suggested;
}

// ── Parse a CSV file and return raw rows ─────────────────────────────────────
function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let headers = null;
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("headers", (h) => { headers = h; })
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve({ headers: headers || Object.keys(rows[0] || {}), rows }))
      .on("error", reject);
  });
}

// ── Map a raw CSV row to a PMS transaction using a column map ────────────────
function mapRow(rawRow, columnMap, tranCodeMap, rowIndex) {
  const get = (field) => {
    const col = columnMap.get ? columnMap.get(field) : columnMap[field];
    return col ? rawRow[col] : undefined;
  };

  const rawTranCode = get("tran_code") || "";
  let tran_code = null;
  if ((tranCodeMap.buy || []).some((v) => rawTranCode.toLowerCase().includes(v.toLowerCase()))) {
    tran_code = "by";
  } else if ((tranCodeMap.sell || []).some((v) => rawTranCode.toLowerCase().includes(v.toLowerCase()))) {
    tran_code = "sl";
  }

  const symbol = (get("symbol") || "").trim().toUpperCase();
  const shares_owned = parseFloat(get("shares_owned"));
  const executed_price = parseFloat(get("executed_price"));
  const cost_basis = parseFloat(get("cost_basis")) || shares_owned * executed_price;

  const errors = [];
  if (!symbol) errors.push("Missing symbol");
  if (isNaN(shares_owned) || shares_owned <= 0) errors.push("Invalid quantity");
  if (isNaN(executed_price) || executed_price <= 0) errors.push("Invalid price");
  if (!tran_code) errors.push(`Unrecognised trade type: "${rawTranCode}"`);

  return {
    row: rowIndex,
    symbol,
    shares_owned: isNaN(shares_owned) ? 0 : shares_owned,
    executed_price: isNaN(executed_price) ? 0 : executed_price,
    cost_basis,
    tran_code,
    rawDate: get("createdAt"),
    errors,
    isValid: errors.length === 0,
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getTemplates() {
  return Object.entries(BROKER_TEMPLATES).map(([key, t]) => ({
    key,
    mappingName: t.mappingName,
    brokerName: t.brokerName,
  }));
}

export async function getUserMappings(userId) {
  return ImportMapping.find({ userId }).lean();
}

export async function saveMapping(data) {
  const { userId, mappingName, brokerName, columnMap, dateFormat, tranCodeMap } = data;
  return ImportMapping.findOneAndUpdate(
    { userId, mappingName },
    { userId, mappingName, brokerName, columnMap, dateFormat, tranCodeMap },
    { upsert: true, new: true }
  );
}

export async function deleteMapping(mappingId, userId) {
  return ImportMapping.findOneAndDelete({ _id: mappingId, userId });
}

export async function previewImport({ filePath, filename, columnMap, tranCodeMap, userId, portfolioId }) {
  const { headers, rows } = await parseCsvFile(filePath);

  // If no columnMap supplied, auto-suggest
  const effectiveColumnMap = columnMap || suggestMapping(headers);
  const effectiveTranCodeMap = tranCodeMap || { buy: ["B", "BUY", "buy", "Purchase"], sell: ["S", "SELL", "sell", "Sale"] };

  const mapped = rows.map((row, i) => mapRow(row, effectiveColumnMap, effectiveTranCodeMap, i + 1));
  const valid = mapped.filter((r) => r.isValid);
  const invalid = mapped.filter((r) => !r.isValid);

  // Duplicate check — find symbols already in the portfolio with same price and qty
  const existingSet = new Set();
  if (portfolioId) {
    const existing = await PortfolioTransactions.find({ portfolio_id: portfolioId })
      .select("symbol shares_owned executed_price tran_code")
      .populate("symbol", "symbol");
    existing.forEach((t) => {
      existingSet.add(`${t.symbol?.symbol}|${t.shares_owned}|${t.executed_price}|${t.tran_code}`);
    });
  }

  const duplicates = [];
  const toImport = [];
  for (const row of valid) {
    const key = `${row.symbol}|${row.shares_owned}|${row.executed_price}|${row.tran_code}`;
    if (existingSet.has(key)) {
      duplicates.push(row);
    } else {
      toImport.push(row);
    }
  }

  return {
    headers,
    suggestedMapping: effectiveColumnMap,
    totalRows: rows.length,
    validRows: valid.length,
    invalidRows: invalid.length,
    duplicateRows: duplicates.length,
    toImportRows: toImport.length,
    preview: toImport.slice(0, 20),   // first 20 rows for UI
    errors: invalid.map((r) => ({ row: r.row, errors: r.errors })),
    duplicates: duplicates.map((r) => ({ row: r.row, symbol: r.symbol })),
  };
}

export async function confirmImport({ filePath, filename, columnMap, tranCodeMap, portfolioId, userId, mappingId }) {
  const { rows } = await parseCsvFile(filePath);
  const effectiveTranCodeMap = tranCodeMap || { buy: ["B", "BUY", "buy", "Purchase"], sell: ["S", "SELL", "sell", "Sale"] };

  const mapped = rows.map((row, i) => mapRow(row, columnMap, effectiveTranCodeMap, i + 1));
  const valid = mapped.filter((r) => r.isValid);

  // Resolve symbols to SecurityMaster IDs
  const symbolCache = {};
  const transactions = [];
  const errors = [];

  for (const row of valid) {
    if (!symbolCache[row.symbol]) {
      symbolCache[row.symbol] = await securityMaster.findOne({ symbol: row.symbol }).select("_id symbol").lean();
    }
    const sec = symbolCache[row.symbol];
    if (!sec) {
      errors.push({ row: row.row, message: `Symbol not in SecurityMaster: ${row.symbol}` });
      continue;
    }
    transactions.push({
      symbol: sec._id,
      shares_owned: row.shares_owned,
      executed_price: row.executed_price,
      cost_basis: row.cost_basis,
      tran_code: row.tran_code,
      portfolio_id: portfolioId,
      createdBy: `import:${filename}`,
    });
  }

  // Bulk insert — skip duplicates via unique index
  let importedRows = 0;
  if (transactions.length > 0) {
    const result = await PortfolioTransactions.insertMany(transactions, { ordered: false });
    importedRows = result.length;
  }

  // Save import history
  const history = await ImportHistory.create({
    userId,
    portfolioId,
    mappingId,
    filename,
    totalRows: rows.length,
    importedRows,
    skippedRows: mapped.filter((r) => !r.isValid).length,
    errorRows: errors.length,
    status: "completed",
    errors,
  });

  return {
    importedRows,
    skippedRows: rows.length - valid.length,
    errorRows: errors.length,
    historyId: history._id,
    errors,
  };
}
