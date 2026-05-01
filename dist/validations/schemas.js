"use strict";

var _Joi$string, _Joi$string2;
var Joi = require("joi");

// ── User ──────────────────────────────────────────────────────────────────────
var registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
var loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});
var watchlistSchema = Joi.object({
  username: Joi.string().required(),
  symbol: Joi.string().uppercase().required()
});

// ── Portfolio ─────────────────────────────────────────────────────────────────
var createPortfolioSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  notes: Joi.string().max(500).allow("", null),
  user_id: Joi.string().required()
});
var updatePortfolioSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  notes: Joi.string().max(500).allow("", null)
}).min(1);

// ── Portfolio Transaction ─────────────────────────────────────────────────────
var createTransactionSchema = Joi.object({
  symbol: Joi.string().required(),
  shares_owned: Joi.number().positive().required(),
  cost_basis: Joi.number().min(0),
  tran_code: Joi.string().valid("by", "sl").required(),
  executed_price: Joi.number().positive().required(),
  target_percentage: Joi.number().min(0).max(100),
  goal: Joi.string().max(200).allow("", null),
  portfolio_id: Joi.string().required(),
  broker_id: Joi.string().allow("", null),
  createdBy: Joi.string()
});

// ── Broker fee config ─────────────────────────────────────────────────────────
var createBrokerConfigSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  buy_commission: Joi.number().min(0).required(),
  sell_commission: Joi.number().min(0).required(),
  default_currency: Joi.string().length(3).uppercase()["default"]("USD"),
  notes: Joi.string().max(500).allow("", null),
  user_id: Joi.string().required()
});
var updateBrokerConfigSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  buy_commission: Joi.number().min(0),
  sell_commission: Joi.number().min(0),
  default_currency: Joi.string().length(3).uppercase(),
  notes: Joi.string().max(500).allow("", null)
}).min(1);

// ── Account ───────────────────────────────────────────────────────────────────
var createAccountSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  currency: Joi.string().length(3).uppercase().required(),
  balance: Joi.number().min(0)["default"](0),
  platformId: Joi.string().allow("", null),
  comment: Joi.string().max(500).allow("", null),
  isExcluded: Joi["boolean"]()["default"](false),
  user_id: Joi.string().required()
});
var updateAccountSchema = Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().min(1).max(100),
  currency: Joi.string().length(3).uppercase(),
  balance: Joi.number().min(0),
  platformId: Joi.string().allow("", null),
  comment: Joi.string().max(500).allow("", null),
  isExcluded: Joi["boolean"](),
  value: Joi.number()
}).min(2);

// ── Exchange Rate ─────────────────────────────────────────────────────────────
var CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD", "INR"];
var createExchangeRateSchema = Joi.object({
  baseCurrency: (_Joi$string = Joi.string()).valid.apply(_Joi$string, CURRENCIES).required(),
  targetCurrency: (_Joi$string2 = Joi.string()).valid.apply(_Joi$string2, CURRENCIES).required(),
  rate: Joi.number().positive().required(),
  date: Joi.date().iso(),
  source: Joi.string().valid("manual", "api", "ecb")["default"]("manual")
});

// ── Import Mapping ────────────────────────────────────────────────────────────
var saveMappingSchema = Joi.object({
  mappingName: Joi.string().min(1).max(100).required(),
  brokerName: Joi.string().max(100).allow("", null),
  columnMap: Joi.object().required(),
  dateFormat: Joi.string().max(50)["default"]("YYYY-MM-DD"),
  userId: Joi.string().required()
});

// ── Voice ─────────────────────────────────────────────────────────────────────
var voiceParseSchema = Joi.object({
  text: Joi.string().min(3).max(500).required()
});

// ── Middleware helper ─────────────────────────────────────────────────────────
function validate(schema) {
  return function (req, res, next) {
    var _schema$validate = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      }),
      error = _schema$validate.error,
      value = _schema$validate.value;
    if (error) {
      var messages = error.details.map(function (d) {
        return d.message;
      }).join("; ");
      return res.status(400).json({
        error: messages
      });
    }
    req.body = value;
    next();
  };
}
module.exports = {
  registerSchema: registerSchema,
  loginSchema: loginSchema,
  watchlistSchema: watchlistSchema,
  createPortfolioSchema: createPortfolioSchema,
  updatePortfolioSchema: updatePortfolioSchema,
  createTransactionSchema: createTransactionSchema,
  createAccountSchema: createAccountSchema,
  updateAccountSchema: updateAccountSchema,
  createExchangeRateSchema: createExchangeRateSchema,
  saveMappingSchema: saveMappingSchema,
  voiceParseSchema: voiceParseSchema,
  createBrokerConfigSchema: createBrokerConfigSchema,
  updateBrokerConfigSchema: updateBrokerConfigSchema,
  validate: validate
};
//# sourceMappingURL=schemas.js.map