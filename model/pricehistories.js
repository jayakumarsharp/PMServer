const mongoose = require("mongoose");


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
export { pricehistories ,bulkInsertOrUpdate };
