// routes/exchangeRateRoutes.js

const express = require('express');
const exhangerouter = express.Router();

import {
  createExchangeRate,
  getExchangeRates,
  updateExchangeRate,
  deleteExchangeRate,
  upsertExchangeRates
} from '../services/ExchangeRateservice';

// Create a new exchange rate
exhangerouter.post('/exchange-rates', createExchangeRate);

// Get exchange rates with optional filters
exhangerouter.get('/exchange-rates', getExchangeRates);

// Update an exchange rate by ID
exhangerouter.put('/exchange-rates/:id', updateExchangeRate);

// Delete an exchange rate by ID
exhangerouter.delete('/exchange-rates/:id', deleteExchangeRate);
exhangerouter.post('/exchange-rates/bulk-upsert', upsertExchangeRates);

export default exhangerouter;
