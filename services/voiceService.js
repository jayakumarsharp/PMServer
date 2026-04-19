import { securityMaster } from "../model/SecurityMaster";

// ── Number word mapping ───────────────────────────────────────────────────────
const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
  eighty: 80, ninety: 90, hundred: 100, thousand: 1000, lakh: 100000,
};

function wordsToNumber(word) {
  const lower = word.toLowerCase();
  if (!isNaN(parseFloat(lower))) return parseFloat(lower);
  return NUMBER_WORDS[lower] || null;
}

// ── Intent keywords ───────────────────────────────────────────────────────────
const BUY_KEYWORDS  = ["buy", "bought", "purchase", "add", "invest", "long"];
const SELL_KEYWORDS = ["sell", "sold", "exit", "remove", "short"];
const PRICE_PREFIXES = ["at", "for", "price", "@", "₹", "rs", "inr", "usd", "$"];

// ── Fuzzy symbol matcher — checks DB for partial name or symbol match ─────────
async function resolveSymbol(rawToken) {
  const upper = rawToken.toUpperCase().trim();

  // Exact symbol match first
  let sec = await securityMaster.findOne({ symbol: upper }).select("symbol longname").lean();
  if (sec) return sec;

  // Partial longname match (e.g., "Reliance" → "RELIANCE INDUSTRIES LIMITED")
  sec = await securityMaster.findOne({
    longname: { $regex: new RegExp(rawToken, "i") },
  }).select("symbol longname").lean();
  if (sec) return sec;

  // Symbol starts-with match (e.g., "RELI" → "RELIANCE.NS")
  sec = await securityMaster.findOne({
    symbol: { $regex: new RegExp(`^${upper}`, "i") },
  }).select("symbol longname").lean();
  return sec || null;
}

// ── Main parser ───────────────────────────────────────────────────────────────
export async function parseVoiceCommand(text) {
  const tokens = text.toLowerCase().replace(/[,₹$]/g, " ").split(/\s+/).filter(Boolean);

  // Detect action
  let action = null;
  let actionIdx = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (BUY_KEYWORDS.includes(tokens[i]))  { action = "by"; actionIdx = i; break; }
    if (SELL_KEYWORDS.includes(tokens[i])) { action = "sl"; actionIdx = i; break; }
  }

  // Extract quantity — first numeric token after action word
  let quantity = null;
  let quantityIdx = -1;
  for (let i = Math.max(0, actionIdx); i < tokens.length; i++) {
    const n = wordsToNumber(tokens[i]);
    if (n !== null) { quantity = n; quantityIdx = i; break; }
  }

  // Extract price — numeric token after a price prefix
  let price = null;
  for (let i = 0; i < tokens.length; i++) {
    if (PRICE_PREFIXES.includes(tokens[i])) {
      const next = tokens[i + 1];
      if (next && !isNaN(parseFloat(next))) {
        price = parseFloat(next);
        break;
      }
    }
  }

  // Extract symbol candidates — tokens that are not action/qty/price/prepositions
  const STOP_WORDS = new Set([
    ...BUY_KEYWORDS, ...SELL_KEYWORDS, ...PRICE_PREFIXES,
    "shares", "units", "of", "in", "the", "a", "stock", "share",
  ]);
  const symbolCandidates = tokens.filter((t, i) =>
    i !== actionIdx && i !== quantityIdx &&
    !STOP_WORDS.has(t) && isNaN(parseFloat(t))
  );

  // Try to resolve symbol from candidates (try longest first, then single tokens)
  let resolvedSymbol = null;
  // Try multi-word company name combinations
  for (let len = symbolCandidates.length; len >= 1; len--) {
    for (let start = 0; start <= symbolCandidates.length - len; start++) {
      const candidate = symbolCandidates.slice(start, start + len).join(" ");
      const sec = await resolveSymbol(candidate);
      if (sec) { resolvedSymbol = sec; break; }
    }
    if (resolvedSymbol) break;
  }

  const confidence = [
    action !== null,
    quantity !== null,
    resolvedSymbol !== null,
  ].filter(Boolean).length / 3;

  return {
    raw: text,
    action,
    quantity,
    price,
    symbol: resolvedSymbol ? resolvedSymbol.symbol : symbolCandidates.join(" ").toUpperCase(),
    symbolResolved: resolvedSymbol !== null,
    symbolName: resolvedSymbol ? resolvedSymbol.longname : null,
    confidence: Math.round(confidence * 100),
    ready: action !== null && quantity !== null && resolvedSymbol !== null,
    warnings: [
      ...(action === null ? ["Could not detect buy or sell intent"] : []),
      ...(quantity === null ? ["Could not detect quantity"] : []),
      ...(resolvedSymbol === null ? [`Symbol not found for: "${symbolCandidates.join(" ")}"`] : []),
      ...(price === null ? ["Price not detected — will use current market price"] : []),
    ],
  };
}
