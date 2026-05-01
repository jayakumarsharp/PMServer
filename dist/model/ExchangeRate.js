"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// models/ExchangeRate.js

var mongoose = require("mongoose");
var ExchangeRateSchema = new mongoose.Schema({
  baseCurrency: {
    type: String,
    required: true,
    uppercase: true,
    "enum": ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"
    // Add other supported currencies
    ]
  },
  targetCurrency: {
    type: String,
    required: true,
    uppercase: true,
    "enum": ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"
    // Add other supported currencies
    ]
  },
  rate: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    "default": Date.now
  },
  source: {
    type: String,
    required: true,
    "enum": ["OpenExchangeRates", "Fixer", "CurrencyLayer", "Other"] // Extend as needed
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Composite Index for baseCurrency and targetCurrency
ExchangeRateSchema.index({
  baseCurrency: 1,
  targetCurrency: 1
}, {
  unique: true
});

// Index on date
ExchangeRateSchema.index({
  date: 1
});
var ExchangeRate = mongoose.model("ExchangeRate", ExchangeRateSchema);
var _default = exports["default"] = ExchangeRate;
//# sourceMappingURL=ExchangeRate.js.map