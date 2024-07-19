const mongoose = require("mongoose");
import { getbySymbol } from "../model/SecurityMaster";
import yahooFinance from "yahoo-finance2";

// Define the schema for price history
const pricehistoriesSchema = new mongoose.Schema({
  securityMaster_id: {
    type: mongoose.Schema.ObjectId,
    ref: "SecurityMaster",
  },
  date: { type: Date, required: true },
  open: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  close: { type: Number, required: true },
  adjClose: { type: Number, required: true },
  volume: { type: Number, required: true },
});

// Create indexes for better performance
pricehistoriesSchema.index({ securityMaster_id: 1, date: 1 }, { unique: true });
const pricehistories = mongoose.model("pricehistories", pricehistoriesSchema);

// Function to handle bulk insert or update of price data
async function bulkInsertOrUpdate(security_id, prices) {
  console.log('security_id',security_id)
  console.log('prices',prices)
  const bulkOps = prices.map((entry) => ({
    updateOne: {
      filter: { securityMaster_id: security_id, date: entry.date },
      update: {
        $set: {
          open: entry.open,
          high: entry.high,
          low: entry.low,
          close: entry.close,
          adjClose: entry.adjClose,
          volume: entry.volume,
        },
      },
      upsert: true,
    },
  }));
  return pricehistories.bulkWrite(bulkOps);
}

// Function to process prices into the required format
function processPrices(prices) {
  const result = [];
  let currentYear = null;
  let currentMonth = null;
  let lastEntry = null;
  let yearData = {};
  let prevDecPrice = null;
  let prevYearDecPrice = null;

  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  prices.forEach((price) => {
    const date = new Date(price.date);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (currentYear !== year) {
      if (currentYear !== null) {
        if (lastEntry) {
          yearData[months[currentMonth]] = lastEntry.close;
        }
        if (prevYearDecPrice !== "NA" && yearData["dec"] !== "NA") {
          yearData["yearlyGrowth"] =
            ((yearData["dec"] - prevYearDecPrice) / prevYearDecPrice) * 100;
        }
        result.push(yearData);
        prevDecPrice = lastEntry ? lastEntry.close : "NA";
        prevYearDecPrice = prevDecPrice;
      }
      currentYear = year;
      yearData = { year: currentYear, growth: {} };
      months.forEach((monthName) => {
        yearData[monthName] = "NA";
      });
    }

    if (currentMonth !== month) {
      if (lastEntry) {
        yearData[months[currentMonth]] = lastEntry.close;
        if (prevDecPrice !== "NA" && yearData[months[currentMonth]] !== "NA") {
          yearData.growth[months[currentMonth]] =
            ((lastEntry.close - prevDecPrice) / prevDecPrice) * 100;
        }
        prevDecPrice = lastEntry.close;
      }
      currentMonth = month;
    }

    lastEntry = price;
  });

  if (lastEntry) {
    yearData[months[currentMonth]] = lastEntry.close;
    if (prevYearDecPrice !== "NA" && yearData["dec"] !== "NA") {
      yearData["yearlyGrowth"] =
        ((yearData["dec"] - prevYearDecPrice) / prevYearDecPrice) * 100;
    }
    result.push(yearData);
  }

  // Set December closing price of the current year to 'NA'
  const currentYearIndex = result.findIndex(
    (yearData) => yearData.year === new Date().getFullYear()
  );
  if (currentYearIndex !== -1) {
    result[currentYearIndex]["dec"] = "NA";
  }

  // Calculate month-over-month growth within the same year
  result.forEach((yearData) => {
    let prevMonthPrice = null;
    months.forEach((monthName) => {
      if (yearData[monthName] !== "NA" && yearData[monthName] !== null) {
        if (prevMonthPrice !== null && prevMonthPrice !== "NA") {
          yearData.growth[monthName] =
            ((yearData[monthName] - prevMonthPrice) / prevMonthPrice) * 100;
        }
        prevMonthPrice = yearData[monthName];
      }
    });
  });

  return result;
}

// Main function to get price list by symbol
async function getpricelistbySymbol(symbol) {
  try {
    const securitydata = await getbySymbol(symbol);
    const security_id = securitydata._id;

    const latestPrice = await pricehistories
      .findOne({ securityMaster_id: security_id })
      .sort({ date: -1 })
      .lean();
    if (latestPrice) {
      const latestDate = new Date(latestPrice.date);
      latestDate.setDate(latestDate.getDate() + 1); // Add one day to latest date
      const firstDayOfCurrentMonth = new Date();
      firstDayOfCurrentMonth.setDate(1);
      firstDayOfCurrentMonth.setHours(0, 0, 0, 0);
      if (latestDate >= firstDayOfCurrentMonth) {
        console.log("Skipping API call, latest prices already up-to-date.");
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 20);

        let prices = await pricehistories
          .find({
            securityMaster_id: security_id,
            date: { $gte: startDate },
          })
          .sort({ date: 1 })
          .lean();
        return processPrices(prices);
      } else {
        console.log("Price exist but current month missing");
        const queryOptions = {
          period1: latestDate.toISOString().split("T")[0],
        };
        const result1 = await yahooFinance.historical(symbol, queryOptions);
        await bulkInsertOrUpdate(security_id, result1);
        let prices = await pricehistories
          .find({
            securityMaster_id: security_id,
            date: { $gte: latestDate },
          })
          .sort({ date: 1 })
          .lean();
        return processPrices(prices);
      }
    } else {
      // If prices are empty, fetch data from external provider
      console.log("price not found");
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 20);

      const queryOptions = { period1: startDate.toISOString().split("T")[0] };

      console.log(queryOptions);
      const result1 = await yahooFinance.historical(symbol, queryOptions);

      await bulkInsertOrUpdate(security_id, result1);

      const prices = await pricehistories
        .find({
          securityMaster_id: security_id,
          date: { $gte: startDate },
        })
        .sort({ date: 1 })
        .lean();

      return processPrices(prices);
    }
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching securityMaster: ${error.message}`);
  }
}

export { pricehistories, getpricelistbySymbol };
