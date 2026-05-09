import Anthropic from "@anthropic-ai/sdk";
import { Portfolio } from "../model/portfolio";
import { PortfolioTransactions } from "../model/portfoliotransactions";
import { securityMaster } from "../model/SecurityMaster";
import { PriceData } from "../model/Pricedata";
import { UserSettings } from "../model/UserSettings";

/**
 * Get user's Claude API key from settings.
 * Throws a clear error if not configured.
 */
async function getUserApiKey(userId) {
  const settings = await UserSettings.findOne({ userId }).lean();
  if (!settings?.claudeApiKey) {
    const err = new Error(
      "Claude API key not configured. Go to Settings → Claude AI to add your key."
    );
    err.status = 400;
    throw err;
  }
  return settings.claudeApiKey;
}

/**
 * Build a rich portfolio context string for Claude.
 * Fetches portfolios, transactions with security + price data.
 */
async function buildPortfolioContext(userId) {
  const portfolios = await Portfolio.find({ user_id: userId }).lean();
  if (!portfolios.length) return "The user has no portfolios yet.";

  const lines = [];
  let grandTotalInvested = 0;
  let grandTotalCurrent = 0;

  for (const pf of portfolios) {
    const txns = await PortfolioTransactions.find({ portfolio_id: pf._id }).lean();

    // Group by symbol to compute net position
    const posMap = {};
    for (const t of txns) {
      const sid = String(t.symbol);
      if (!posMap[sid]) posMap[sid] = { shares: 0, cost: 0, symbolId: t.symbol };
      const isBuy = ["by", "buy", "B"].includes(t.tran_code);
      const isSell = ["sl", "sell", "S"].includes(t.tran_code);
      if (isBuy) {
        posMap[sid].shares += t.shares_owned || 0;
        posMap[sid].cost += (t.shares_owned || 0) * (t.executed_price || 0);
      } else if (isSell) {
        posMap[sid].shares -= t.shares_owned || 0;
      }
    }

    const holdingLines = [];
    let pfInvested = 0;
    let pfCurrent = 0;

    for (const [sid, pos] of Object.entries(posMap)) {
      if (pos.shares <= 0) continue;
      const sec = await securityMaster.findById(pos.symbolId).lean();
      const price = await PriceData.findOne({ securityMaster_id: pos.symbolId }).lean();
      const name = sec?.longName || sec?.symbol || sid;
      const symbol = sec?.symbol || sid;
      const avgCost = pos.shares > 0 ? pos.cost / pos.shares : 0;
      const currentPrice = price?.regularMarketPrice || 0;
      const currentValue = pos.shares * currentPrice;
      const invested = pos.cost;
      const gainLoss = currentValue - invested;
      const gainPct = invested > 0 ? ((gainLoss / invested) * 100).toFixed(1) : "0.0";

      pfInvested += invested;
      pfCurrent += currentValue;

      holdingLines.push(
        `  - ${symbol} (${name}): ${pos.shares} shares @ avg ₹${avgCost.toFixed(2)}, ` +
        `current ₹${currentPrice.toFixed(2)}, value ₹${currentValue.toFixed(0)}, ` +
        `P&L ₹${gainLoss.toFixed(0)} (${gainPct}%)`
      );
    }

    grandTotalInvested += pfInvested;
    grandTotalCurrent += pfCurrent;

    const pfGain = pfCurrent - pfInvested;
    const pfGainPct = pfInvested > 0 ? ((pfGain / pfInvested) * 100).toFixed(1) : "0.0";

    lines.push(`Portfolio: "${pf.name}"${pf.notes ? ` (${pf.notes})` : ""}`);
    lines.push(`  Invested: ₹${pfInvested.toFixed(0)}, Current: ₹${pfCurrent.toFixed(0)}, P&L: ₹${pfGain.toFixed(0)} (${pfGainPct}%)`);
    if (holdingLines.length) {
      lines.push("  Holdings:");
      lines.push(...holdingLines);
    } else {
      lines.push("  No active holdings.");
    }
    lines.push("");
  }

  const totalGain = grandTotalCurrent - grandTotalInvested;
  const totalGainPct = grandTotalInvested > 0 ? ((totalGain / grandTotalInvested) * 100).toFixed(1) : "0.0";
  lines.unshift(
    `=== PORTFOLIO SUMMARY ===`,
    `Total Invested: ₹${grandTotalInvested.toFixed(0)}`,
    `Total Current Value: ₹${grandTotalCurrent.toFixed(0)}`,
    `Overall P&L: ₹${totalGain.toFixed(0)} (${totalGainPct}%)`,
    ``
  );

  return lines.join("\n");
}

/**
 * Send a message to Claude with portfolio context.
 * @param {string} userId - MongoDB user ID
 * @param {string} userMessage - The question/request from the user
 * @param {string} analysisType - e.g. "general", "risk", "rebalance", "tax"
 * @param {Array}  chatHistory - [{role, content}] for multi-turn
 * @returns {string} Claude's text response
 */
async function analyzePortfolio({ userId, userMessage, analysisType = "general", chatHistory = [] }) {
  const apiKey = await getUserApiKey(userId);
  const client = new Anthropic({ apiKey });

  const portfolioContext = await buildPortfolioContext(userId);

  const staticSystemText = `You are an expert Indian stock market portfolio analyst and financial advisor.
You have deep knowledge of NSE/BSE markets, Indian tax laws (STCG/LTCG), and retail investment strategies.

Guidelines:
- All monetary values are in Indian Rupees (₹) unless stated otherwise
- Reference specific holdings by name when giving advice
- For tax questions: STCG applies to equity held < 12 months (15% tax), LTCG > ₹1L gain taxed at 10%
- Be concise but thorough. Use bullet points for clarity.
- If the portfolio is empty, encourage the user to add holdings via the Import feature`;

  // System as array with cache_control on the large static block
  const system = [
    {
      type: "text",
      text: staticSystemText,
      cache_control: { type: "ephemeral" },
    },
    {
      type: "text",
      text: `Current portfolio data:\n${portfolioContext}\n\nAnalysis type requested: ${analysisType}`,
    },
  ];

  const messages = [
    ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system,
    messages,
    betas: ["prompt-caching-2024-07-31"],
  });

  return response.content[0]?.text || "No response from Claude.";
}

/**
 * Save or update Claude API key for a user.
 */
async function saveApiKey(userId, claudeApiKey) {
  const settings = await UserSettings.findOneAndUpdate(
    { userId },
    { $set: { claudeApiKey, aiAnalysisEnabled: !!claudeApiKey } },
    { upsert: true, new: true }
  ).lean();
  return { saved: true, aiAnalysisEnabled: settings.aiAnalysisEnabled };
}

/**
 * Get settings (without exposing the full key — just masked).
 */
async function getSettings(userId) {
  const settings = await UserSettings.findOne({ userId }).lean();
  const key = settings?.claudeApiKey;
  return {
    hasApiKey: !!key,
    apiKeyMasked: key ? `sk-ant-...${key.slice(-6)}` : null,
    aiAnalysisEnabled: settings?.aiAnalysisEnabled || false,
    defaultCurrency: settings?.defaultCurrency || "INR",
  };
}

/**
 * Update general settings (currency, etc.) without touching the API key.
 */
async function updateSettings(userId, { defaultCurrency }) {
  const update = {};
  if (defaultCurrency) update.defaultCurrency = defaultCurrency;
  const settings = await UserSettings.findOneAndUpdate(
    { userId },
    { $set: update },
    { upsert: true, new: true }
  ).lean();
  return { defaultCurrency: settings.defaultCurrency };
}

export { analyzePortfolio, saveApiKey, getSettings, updateSettings };
