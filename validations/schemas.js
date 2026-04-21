const Joi = require("joi");

// ── User ──────────────────────────────────────────────────────────────────────
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const watchlistSchema = Joi.object({
  username: Joi.string().required(),
  symbol: Joi.string().uppercase().required(),
});

// ── Portfolio ─────────────────────────────────────────────────────────────────
const createPortfolioSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  notes: Joi.string().max(500).allow("", null),
  user_id: Joi.string().required(),
});

const updatePortfolioSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  notes: Joi.string().max(500).allow("", null),
}).min(1);

// ── Portfolio Transaction ─────────────────────────────────────────────────────
const createTransactionSchema = Joi.object({
  symbol: Joi.string().required(),
  shares_owned: Joi.number().positive().required(),
  cost_basis: Joi.number().min(0),
  tran_code: Joi.string().valid("by", "sl").required(),
  executed_price: Joi.number().positive().required(),
  target_percentage: Joi.number().min(0).max(100),
  goal: Joi.string().max(200).allow("", null),
  portfolio_id: Joi.string().required(),
  broker_id: Joi.string().allow("", null),
  createdBy: Joi.string(),
});

// ── Broker fee config ─────────────────────────────────────────────────────────
const createBrokerConfigSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  buy_commission: Joi.number().min(0).required(),
  sell_commission: Joi.number().min(0).required(),
  default_currency: Joi.string().length(3).uppercase().default("USD"),
  notes: Joi.string().max(500).allow("", null),
  user_id: Joi.string().required(),
});

const updateBrokerConfigSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  buy_commission: Joi.number().min(0),
  sell_commission: Joi.number().min(0),
  default_currency: Joi.string().length(3).uppercase(),
  notes: Joi.string().max(500).allow("", null),
}).min(1);

// ── Account ───────────────────────────────────────────────────────────────────
const createAccountSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  currency: Joi.string().length(3).uppercase().required(),
  balance: Joi.number().min(0).default(0),
  platformId: Joi.string().allow("", null),
  comment: Joi.string().max(500).allow("", null),
  isExcluded: Joi.boolean().default(false),
  user_id: Joi.string().required(),
});

const updateAccountSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().min(1).max(100),
  currency: Joi.string().length(3).uppercase(),
  balance: Joi.number().min(0),
  platformId: Joi.string().allow("", null),
  comment: Joi.string().max(500).allow("", null),
  isExcluded: Joi.boolean(),
  value: Joi.number(),
}).min(2);

// ── Exchange Rate ─────────────────────────────────────────────────────────────
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD", "INR"];

const createExchangeRateSchema = Joi.object({
  baseCurrency: Joi.string().valid(...CURRENCIES).required(),
  targetCurrency: Joi.string().valid(...CURRENCIES).required(),
  rate: Joi.number().positive().required(),
  date: Joi.date().iso(),
  source: Joi.string().valid("manual", "api", "ecb").default("manual"),
});

// ── Import Mapping ────────────────────────────────────────────────────────────
const saveMappingSchema = Joi.object({
  mappingName: Joi.string().min(1).max(100).required(),
  brokerName: Joi.string().max(100).allow("", null),
  columnMap: Joi.object().required(),
  dateFormat: Joi.string().max(50).default("YYYY-MM-DD"),
  userId: Joi.string().required(),
});

// ── Voice ─────────────────────────────────────────────────────────────────────
const voiceParseSchema = Joi.object({
  text: Joi.string().min(3).max(500).required(),
});

// ── Middleware helper ─────────────────────────────────────────────────────────
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map((d) => d.message).join("; ");
      return res.status(400).json({ error: messages });
    }
    req.body = value;
    next();
  };
}

module.exports = {
  registerSchema,
  loginSchema,
  watchlistSchema,
  createPortfolioSchema,
  updatePortfolioSchema,
  createTransactionSchema,
  createAccountSchema,
  updateAccountSchema,
  createExchangeRateSchema,
  saveMappingSchema,
  voiceParseSchema,
  createBrokerConfigSchema,
  updateBrokerConfigSchema,
  validate,
};
