import { getbySymbol } from "../model/SecurityMaster";
import { pricehistories, bulkInsertOrUpdate } from "../model/pricehistories";

async function getATHpricelistbySymbol(obj) {
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
      } else {
        console.log("Price exists but current month missing");
        const queryOptions = {
          period1: new Date(latestDate.setDate(latestDate.getDate() + 1))
            .toISOString()
            .split("T")[0], // Add one day to latestDate
        };
        const result1 = await yahooFinance.historical(symbol, queryOptions);
        await bulkInsertOrUpdate(security_id, result1);
      }
    } else {
      console.log("Price not found");
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 20);

      const queryOptions = { period1: startDate.toISOString().split("T")[0] };
      const result1 = await yahooFinance.historical(symbol, queryOptions);

      await bulkInsertOrUpdate(security_id, result1);
    }

    const startDate = new Date(obj.fromDate);
    const endDate = new Date(obj.toDate);
    let prices = await pricehistories
      .find({
        securityMaster_id: security_id,
        date: { $gte: startDate, $lte: endDate },
      })
      .sort({ date: 1 })
      .lean();

    if (prices.length === 0) {
      const queryOptions = { period1: startDate.toISOString().split("T")[0] };
      const result1 = await yahooFinance.historical(symbol, queryOptions);
      await bulkInsertOrUpdate(security_id, result1);
      prices = await pricehistories
        .find({
          securityMaster_id: security_id,
          date: { $gte: startDate, $lte: endDate },
        })
        .sort({ date: 1 })
        .lean();
    }

    const response = processPrices(prices);
    return response;
  } catch (error) {
    return { error: `Error while fetching securityMaster: ${error.message}` };
  }
}

function processPrices(prices) {
  const stockPrices = prices;
  let obj = [];
  let allTimeHigh = 0;
  let daysToBreakHigh = [];
  let lastHighDate = "";
  let lastDate = "";
  let dayCount = 0;

  // Track breakouts by year and month
  let breakoutCount = {};

  for (const entry of stockPrices) {
    const date = new Date(entry.date);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const price = parseFloat(entry.close);
    dayCount++;

    if (price > allTimeHigh) {
      if (allTimeHigh > 0) {
        daysToBreakHigh.push(dayCount);
        // console.log(
        //   `New all-time high on ${date}, Previous high on ${lastDate}, Days to break: ${dayCount}`
        // );
      }

      obj.push({
        allTimeHigh: allTimeHigh,
        lastHighDate: date,
        lastDate: lastDate,
        dayCount: dayCount,
      });

      // Update breakout count for the month and year
      if (!breakoutCount[year]) {
        breakoutCount[year] = {};
      }
      if (!breakoutCount[year][month]) {
        breakoutCount[year][month] = 0;
      }
      breakoutCount[year][month]++;

      allTimeHigh = price;
      lastHighDate = lastDate;
      lastDate = date;
      dayCount = 0;
    }
  }

  // Return the structured breakout data
  return {
    breakoutData: breakoutCount,
    allTimeHighcount: daysToBreakHigh,
    trackdata: obj,
    rawPrices: stockPrices,
  };
}

export { getATHpricelistbySymbol };
