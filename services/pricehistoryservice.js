import { getbySymbol } from "../model/SecurityMaster";
import { pricehistories, bulkInsertOrUpdate } from "../model/pricehistories";
import yahooFinance from "yahoo-finance2";
import Carg from "../model/Carg"; // Import the Carg model

// Define the months array at the top level
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

// Main function to get price list by symbol
async function getpricelistbySymbol(obj) {
  try {
    const securitydata = await getbySymbol(obj.symbol);
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
        const startDate = new Date(2000, 0, 1); // Always fetch data from the year 2000

        let prices = await pricehistories
          .find({
            securityMaster_id: security_id,
            date: { $gte: startDate },
          })
          .sort({ date: 1 })
          .lean();

        return await processPrices(prices, obj.fromDate, obj.toDate, security_id);
      } else {
        console.log("Price exists but current month missing");
        const queryOptions = {
          period1: new Date(latestDate.setDate(latestDate.getDate() + 1))
            .toISOString()
            .split("T")[0],
        };
        const result1 = await yahooFinance.historical(obj.symbol, queryOptions);
        await bulkInsertOrUpdate(security_id, result1);
        const startDate = new Date(2000, 0, 1); // Always fetch data from the year 2000
        let prices = await pricehistories
          .find({
            securityMaster_id: security_id,
            date: { $gte: startDate },
          })
          .sort({ date: 1 })
          .lean();
        return await processPrices(prices, obj.fromDate, obj.toDate, security_id);
      }
    } else {
      // If prices are empty, fetch data from external provider
      console.log("Price not found");
      const startDate = new Date(2000, 0, 1); // Always fetch data from the year 2000

      const queryOptions = { period1: startDate.toISOString().split("T")[0] };

      console.log(queryOptions);
      const result1 = await yahooFinance.historical(obj.symbol, queryOptions);

      await bulkInsertOrUpdate(security_id, result1);

      const prices = await pricehistories
        .find({
          securityMaster_id: security_id,
          date: { $gte: startDate },
        })
        .sort({ date: 1 })
        .lean();

      return await processPrices(prices, obj.fromDate, obj.toDate, security_id);
    }
  } catch (error) {
    // Handle any errors that occur during the process
    throw new Error(`Error while fetching securityMaster: ${error.message}`);
  }
}

// Function to calculate CAGR
function calculateCagr(startValue, endValue, years) {
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
}

// Function to process prices into the required format
async function processPrices(prices, fromDate, toDate, security_id) {
  const result = [];
  let currentYear = null;
  let currentMonth = null;
  let lastEntry = null;
  let yearData = {};
  let prevDecPrice = null;
  let prevYearDecPrice = null;

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

  // Set the closing price of the current year to the most recent month's closing price
  const currentYearIndex = result.findIndex(
    (yearData) => yearData.year === new Date().getFullYear()
  );
  if (currentYearIndex !== -1) {
    result[currentYearIndex][months[new Date().getMonth()]] = lastEntry.close;
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

  // Filter prices within the specified date range
  const filteredPrices = result.filter(yearData => {
    const year = yearData.year;
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    return year >= startDate.getFullYear() && year <= endDate.getFullYear();
  });

  // Calculate individual CAGRs
  const latestYear = result[result.length - 1];
  const latestPrice = parseFloat(latestYear[months[new Date().getMonth()]]);

  const cagrResults = await getCagrResults(result, latestPrice, security_id);

  return { prices: filteredPrices, cagr: cagrResults };
}

// Function to get CAGRs, either from the database or by calculating them
async function getCagrResults(result, latestPrice, security_id) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Check if CARG data already exists for the current year and month
  const existingCarg = await Carg.findOne({
    securityMaster_id: security_id,
    year: currentYear,
    month: currentMonth,
  }).lean();

  const daysSinceLastUpdate = existingCarg ? (new Date() - new Date(existingCarg.updatedAt)) / (1000 * 60 * 60 * 24) : null;

  if (existingCarg && daysSinceLastUpdate <= 45) {
    return {
      "CAGR_1yr": existingCarg.cagr1yr !== null ? existingCarg.cagr1yr : "NA",
      "CAGR_3yr": existingCarg.cagr3yr !== null ? existingCarg.cagr3yr : "NA",
      "CAGR_5yr": existingCarg.cagr5yr !== null ? existingCarg.cagr5yr : "NA",
      "CAGR_10yr": existingCarg.cagr10yr !== null ? existingCarg.cagr10yr : "NA"
    };
  }

  // Calculate CAGRs if not already available
  const cagrResults = {};

  if (!isNaN(latestPrice)) {
    cagrResults["CAGR_1yr"] = calculate1YrCAGR(result, latestPrice) || "NA";
    cagrResults["CAGR_3yr"] = calculate3YrCAGR(result, latestPrice) || "NA";
    cagrResults["CAGR_5yr"] = calculate5YrCAGR(result, latestPrice) || "NA";
    cagrResults["CAGR_10yr"] = calculate10YrCAGR(result, latestPrice) || "NA";
  } else {
    cagrResults["CAGR_1yr"] = "NA";
    cagrResults["CAGR_3yr"] = "NA";
    cagrResults["CAGR_5yr"] = "NA";
    cagrResults["CAGR_10yr"] = "NA";
  }

  // Store the calculated CARG data
  await Carg.findOneAndUpdate(
    {
      securityMaster_id: security_id,
      year: currentYear,
      month: currentMonth,
    },
    {
      $set: {
        cagr1yr: cagrResults["CAGR_1yr"] !== "NA" ? cagrResults["CAGR_1yr"] : null,
        cagr3yr: cagrResults["CAGR_3yr"] !== "NA" ? cagrResults["CAGR_3yr"] : null,
        cagr5yr: cagrResults["CAGR_5yr"] !== "NA" ? cagrResults["CAGR_5yr"] : null,
        cagr10yr: cagrResults["CAGR_10yr"] !== "NA" ? cagrResults["CAGR_10yr"] : null,
      },
    },
    { upsert: true, new: true }
  );

  return cagrResults;
}

// Function to calculate 1-year CAGR
function calculate1YrCAGR(prices, latestPrice) {
  const currentYear = new Date().getFullYear();
  const yearData = prices.find(yearData => yearData.year === currentYear - 1);
  if (yearData && yearData[months[new Date().getMonth()]] !== "NA") {
    const startValue = parseFloat(yearData[months[new Date().getMonth()]]);
    if (!isNaN(startValue)) {
      return calculateCagr(startValue, latestPrice, 1);
    }
  }
  return "NA";
}

// Function to calculate 3-year CAGR
function calculate3YrCAGR(prices, latestPrice) {
  const currentYear = new Date().getFullYear();
  const yearData = prices.find(yearData => yearData.year === currentYear - 3);
  if (yearData && yearData[months[new Date().getMonth()]] !== "NA") {
    const startValue = parseFloat(yearData[months[new Date().getMonth()]]);
    if (!isNaN(startValue)) {
      return calculateCagr(startValue, latestPrice, 3);
    }
  }
  return "NA";
}

// Function to calculate 5-year CAGR
function calculate5YrCAGR(prices, latestPrice) {
  const currentYear = new Date().getFullYear();
  const yearData = prices.find(yearData => yearData.year === currentYear - 5);
  if (yearData && yearData[months[new Date().getMonth()]] !== "NA") {
    const startValue = parseFloat(yearData[months[new Date().getMonth()]]);
    if (!isNaN(startValue)) {
      return calculateCagr(startValue, latestPrice, 5);
    }
  }
  return "NA";
}

// Function to calculate 10-year CAGR
function calculate10YrCAGR(prices, latestPrice) {
  const currentYear = new Date().getFullYear();
  const yearData = prices.find(yearData => yearData.year === currentYear - 10);
  if (yearData && yearData[months[new Date().getMonth()]] !== "NA") {
    const startValue = parseFloat(yearData[months[new Date().getMonth()]]);
    if (!isNaN(startValue)) {
      return calculateCagr(startValue, latestPrice, 10);
    }
  }
  return "NA";
}

export { getpricelistbySymbol };
