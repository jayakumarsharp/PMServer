import mongoose from "mongoose";

const importMappingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mappingName: { type: String, required: true, trim: true },
    brokerName: { type: String, trim: true, default: "" },
    // Maps our field names → the user's CSV column header
    // e.g. { symbol: "Scrip Name", shares_owned: "Qty", executed_price: "Buy Price" }
    columnMap: { type: Map, of: String, required: true },
    dateFormat: { type: String, default: "YYYY-MM-DD" },
    // How to interpret tran_code values in the CSV
    // e.g. { buy: ["B", "BUY", "Purchase"], sell: ["S", "SELL", "Sale"] }
    tranCodeMap: {
      buy: { type: [String], default: ["B", "BUY", "buy", "Purchase"] },
      sell: { type: [String], default: ["S", "SELL", "sell", "Sale"] },
    },
  },
  { timestamps: true }
);

importMappingSchema.index({ userId: 1, mappingName: 1 }, { unique: true });

const ImportMapping = mongoose.model("ImportMapping", importMappingSchema);
export default ImportMapping;
