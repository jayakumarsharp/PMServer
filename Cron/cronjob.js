const cron = require("node-cron");
import yahooFinance from "yahoo-finance2";
import { PriceData, updateprice } from "../model/Pricedata";
import { JobMonitor } from "../model/jobMonitor";
import { securityMaster } from "../model/SecurityMaster";
import { pricehistories, updatepricedata } from "../model/pricehistories";
import { PortfolioTransactions } from "../model/portfoliotransactions";

const moment = require("moment");

async function fetchDataAndUpdate() {
  const jobName = "fetchDataAndUpdate";
  const runningStatus = "running";
  const completedStatus = "completed";

  try {
    const jobMonitor = await JobMonitor.findOne({ jobName });

    if (jobMonitor && jobMonitor.status === runningStatus) {
      console.log("Job already running. Skipping this run.");
      return;
    }

    await JobMonitor.findOneAndUpdate(
      { jobName },
      { status: runningStatus, lastRun: new Date() },
      { upsert: true }
    );

    console.log("Data fetched from API:");

    const thirtyMinutesAgo = moment().subtract(50, "minutes").toDate();

    const symbolsWithTransactionsAndOldPriceData =
      await securityMaster.aggregate([
        {
          $lookup: {
            from: "portfoliotransactions", // Name of the PortfolioTransactions collection
            localField: "_id",
            foreignField: "symbol",
            as: "transactions",
          },
        },
        {
          $match: {
            transactions: { $exists: true, $ne: [] }, // Filter documents where transactions array exists and is not empty
          },
        },
        {
          $lookup: {
            from: "pricedatas", // Name of the PriceData collection
            localField: "_id",
            foreignField: "securityMaster_id",
            as: "priceData",
          },
        },
        {
          $match: {
            $or: [
              { priceData: { $size: 0 } }, // No price data entries
              { "priceData.lastUpdated": { $lt: thirtyMinutesAgo } }, // Price data last updated more than 30 minutes ago
            ],
          },
        },
        {
          $project: {
            _id: 0,
            symbol: "$symbol",
          },
        },
      ]);

    const symbolArray = symbolsWithTransactionsAndOldPriceData.map(
      (item) => item.symbol
    );

    console.log("symbolArray:", symbolArray);

    if (symbolArray.length > 0) {
      var result = await yahooFinance.quote(
        symbolArray,
        {},
        { validateResult: false }
      );
      console.log(result);
      const updatePromises = result.map((data) => updateprice(data));
      const results = await Promise.all(updatePromises);
      console.log(results);
    }

    // Sync daily price history for all active holdings using yahooFinance.chart()
    const yesterday = moment().subtract(2, "days").toDate();

    const priceHistorySecurities = await securityMaster
      .aggregate([
        {
          $lookup: {
            from: "portfoliotransactions",
            localField: "_id",
            foreignField: "symbol",
            as: "transactions",
          },
        },
        { $match: { transactions: { $exists: true, $ne: [] } } },
        {
          $lookup: {
            from: "pricehistories",
            localField: "_id",
            foreignField: "securityMaster_id",
            as: "priceHistory",
          },
        },
        {
          $addFields: {
            latestPriceHistory: {
              $cond: {
                if: { $eq: [{ $size: "$priceHistory" }, 0] },
                then: null,
                else: { $arrayElemAt: ["$priceHistory", -1] },
              },
            },
          },
        },
        {
          $match: {
            $or: [
              { priceHistory: { $size: 0 } },
              { "latestPriceHistory.date": { $lt: yesterday } },
            ],
          },
        },
        {
          $project: {
            symbol: 1,
            latestPriceHistory: 1,
          },
        },
        { $limit: 5 }, // Process up to 5 symbols per run to avoid rate limits
      ])
      .exec();

    console.log("Price history sync — symbols to update:", priceHistorySecurities.length);

    for (const sec of priceHistorySecurities) {
      let startDate = "2000-01-01";
      if (sec.latestPriceHistory) {
        startDate = moment(sec.latestPriceHistory.date).add(1, "days").format("YYYY-MM-DD");
      }
      const today = moment().format("YYYY-MM-DD");

      if (!moment(startDate).isBefore(today)) {
        console.log("Price history up to date for", sec.symbol);
        continue;
      }

      await delay(2000); // 2s between requests to avoid rate limiting
      console.log("Fetching price history for", sec.symbol, "from", startDate);

      try {
        const chartResult = await yahooFinance.chart(sec.symbol, {
          period1: startDate,
          interval: "1d",
          events: "history",
        }, { validateResult: false });

        const quotes = chartResult?.quotes || [];
        if (quotes.length) {
          await Promise.all(
            quotes.map(async (entry) => {
              await updatepricedata({
                symbol: sec.symbol,
                securityMaster_id: sec._id,
                date: entry.date,
                open: entry.open,
                high: entry.high,
                low: entry.low,
                close: entry.close,
                adjclose: entry.adjclose,
                volume: entry.volume,
              });
            })
          );
          console.log(`Saved ${quotes.length} price history records for ${sec.symbol}`);
        }
      } catch (chartErr) {
        console.warn(`Price history fetch failed for ${sec.symbol}:`, chartErr.message);
      }
    }
  } catch (error) {
    console.error("Error fetching or updating data:", error);
  } finally {
    await JobMonitor.findOneAndUpdate(
      { jobName },
      { status: completedStatus, lastRun: new Date() },
      { upsert: true }
    );
  }
}

// Schedule the CRON job (only when this file is required directly, i.e. local/Railway)
cron.schedule("*/30 * * * *", () => {
  console.log("Running the CRON job...");
  fetchDataAndUpdate();
});

console.log("CRON job scheduled. It will run according to the defined interval.");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { fetchDataAndUpdate };
