// controllers/exchangeRateController.js
import ExchangeRate from "../model/ExchangeRate";

// Create a new exchange rate
const createExchangeRate = async (req, res) => {
  try {
    const { baseCurrency, targetCurrency, rate, date, source } = req.body;

    // Validate that baseCurrency and targetCurrency are not the same
    if (baseCurrency === targetCurrency) {
      return res.status(400).json({ message: 'Base and target currencies must differ.' });
    }

    const exchangeRate = new ExchangeRate({
      baseCurrency,
      targetCurrency,
      rate,
      date,
      source,
    });

    await exchangeRate.save();
    res.status(201).json(exchangeRate);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: 'Exchange rate for this currency pair already exists.' });
    } else {
      res.status(500).json({ message: 'Server error.', error });
    }
  }
};

// Read exchange rates with optional filters
const getExchangeRates = async (req, res) => {
  try {
    const { baseCurrency, targetCurrency, date, source } = req.query;
    const filter = {};

    if (baseCurrency) filter.baseCurrency = baseCurrency.toUpperCase();
    if (targetCurrency) filter.targetCurrency = targetCurrency.toUpperCase();
    if (date) filter.date = new Date(date);
    if (source) filter.source = source;

    const exchangeRates = await ExchangeRate.find(filter).sort({ date: -1 });
    res.status(200).json(exchangeRates);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Update an exchange rate
const updateExchangeRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { rate, date, source } = req.body;

    const exchangeRate = await ExchangeRate.findById(id);
    if (!exchangeRate) {
      return res.status(404).json({ message: 'Exchange rate not found.' });
    }

    if (rate !== undefined) exchangeRate.rate = rate;
    if (date !== undefined) exchangeRate.date = date;
    if (source !== undefined) exchangeRate.source = source;

    await exchangeRate.save();
    res.status(200).json(exchangeRate);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};

// Delete an exchange rate
const deleteExchangeRate = async (req, res) => {
  try {
    const { id } = req.params;

    const exchangeRate = await ExchangeRate.findByIdAndDelete(id);
    if (!exchangeRate) {
      return res.status(404).json({ message: 'Exchange rate not found.' });
    }

    res.status(200).json({ message: 'Exchange rate deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
};


const upsertExchangeRates = async (req, res) => {
    try {
      const exchangeRates = req.body.exchangeRates;
  
      if (!Array.isArray(exchangeRates) || exchangeRates.length === 0) {
        return res.status(400).json({ message: 'exchangeRates must be a non-empty array.' });
      }
  
      // Validate each exchange rate entry
      for (const rate of exchangeRates) {
        const { baseCurrency, targetCurrency, rate: rateValue, date, source } = rate;
  
        if (!baseCurrency || !targetCurrency || !rateValue || !date || !source) {
          return res.status(400).json({
            message: 'Each exchange rate must include baseCurrency, targetCurrency, rate, date, and source.',
          });
        }
  
        if (baseCurrency === targetCurrency) {
          return res.status(400).json({
            message: `Base currency and target currency cannot be the same for symbol ${baseCurrency}.`,
          });
        }
      }
  
      // Prepare bulk operations
      const bulkOps = exchangeRates.map((rate) => ({
        updateOne: {
          filter: {
            baseCurrency: rate.baseCurrency.toUpperCase(),
            targetCurrency: rate.targetCurrency.toUpperCase(),
            date: new Date(rate.date),
          },
          update: {
            $set: {
              rate: rate.rate,
              source: rate.source,
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      }));
  
      // Execute bulk operations
      const bulkWriteResult = await ExchangeRate.bulkWrite(bulkOps);
  
      res.status(200).json({
        message: 'Bulk upsert operation completed successfully.',
        result: bulkWriteResult,
      });
    } catch (error) {
      console.error('Bulk Upsert Error:', error);
      res.status(500).json({ message: 'Server error during bulk upsert.', error });
    }
  };
  
  export  {
    createExchangeRate,
    getExchangeRates,
    updateExchangeRate,
    deleteExchangeRate,
    upsertExchangeRates, // Export the new function
  };

