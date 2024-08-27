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

    // const today = new Date(); // Today's date
    // const yesterday = new Date(today);
    // yesterday.setDate(today.getDate() - 2); // Yesterday's date

    // const pricehistorysecurityresult = await securityMaster
    //   .aggregate([
    //     {
    //       $lookup: {
    //         from: "pricehistories",
    //         localField: "_id",
    //         foreignField: "securityMaster_id",
    //         as: "priceHistory",
    //       },
    //     },
    //     {
    //       $addFields: {
    //         latestPriceHistory: {
    //           $cond: {
    //             if: { $eq: [{ $size: "$priceHistory" }, 0] },
    //             then: null,
    //             else: { $arrayElemAt: ["$priceHistory", -1] },
    //           },
    //         },
    //       },
    //     },
    //     {
    //       $match: {
    //         $or: [
    //           { priceHistory: { $size: 0 } },
    //           { "latestPriceHistory.date": { $gt: yesterday } },
    //         ],
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 0,
    //         symbol: "$symbol",
    //         latestPriceHistory: 1,
    //         latestPriceDate: "$latestPriceHistory.date",
    //       },
    //     },
    //     {
    //       $limit: 1,
    //     },
    //   ])
    //   .exec();

    // console.log("Records:", pricehistorysecurityresult);

    // for (const secsymbol of pricehistorysecurityresult) {
    //   //   // Find the last entry date for the symbol

    //   // const lastEntry = await pricehistories
    //   //   .findOne({ securityMaster_id: secsymbol._id })
    //   //   .sort({ date: -1 })
    //   //   .lean();

    //   // Determine the start date for the query
    //   let startDate = "2000-01-01"; // Default start date
    //   if (secsymbol.latestPriceHistory) {
    //     startDate = moment(secsymbol.latestPriceHistory.date).add(1, "days").format("YYYY-MM-DD");
    //   }
    //   console.log("start date", startDate);
    //   // Set query options
    //   const queryOptions = { period1: startDate };
    //   const today = moment().format("YYYY-MM-DD");
    //   if (moment(startDate).isBefore(today)) {
    //     // Introduce a delay before making the API call
    //     await delay(1500); // 15 seconds delay
    //     console.log("calling yahoo", secsymbol.symbol);
    //     // Fetch historical data from Yahoo Finance API
    //     const result1 = await yahooFinance.historical(
    //       secsymbol.symbol,
    //       queryOptions
    //     );

    //     // Save or update each historical data entry to the database
    //     var priceupdateresponse = await Promise.all(
    //       result1.map(async (entry) => {
    //         entry.symbol = secsymbol.symbol;
    //         await updatepricedata(entry);
    //       })
    //     );
    // } else {
    //   console.log("skpped price since already exist", secsymbol.symbol);
    // }
    // }
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

// Schedule the CRON job
cron.schedule('*/30 * * * *', () => {
  console.log("Running the CRON job...");
  fetchDataAndUpdate();
});


console.log(
  "CRON job scheduled. It will run according to the defined interval."
);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
