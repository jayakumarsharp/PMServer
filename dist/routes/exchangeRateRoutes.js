"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ExchangeRateservice = require("../services/ExchangeRateservice");
// routes/exchangeRateRoutes.js

var express = require('express');
var exhangerouter = express.Router();
// Create a new exchange rate
exhangerouter.post('/exchange-rates', _ExchangeRateservice.createExchangeRate);

// Get exchange rates with optional filters
exhangerouter.get('/exchange-rates', _ExchangeRateservice.getExchangeRates);

// Update an exchange rate by ID
exhangerouter.put('/exchange-rates/:id', _ExchangeRateservice.updateExchangeRate);

// Delete an exchange rate by ID
exhangerouter["delete"]('/exchange-rates/:id', _ExchangeRateservice.deleteExchangeRate);
exhangerouter.post('/exchange-rates/bulk-upsert', _ExchangeRateservice.upsertExchangeRates);
var _default = exports["default"] = exhangerouter;
//# sourceMappingURL=exchangeRateRoutes.js.map