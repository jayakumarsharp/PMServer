import mongoose from "mongoose";

const importHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: "Portfolio" },
    mappingId: { type: mongoose.Schema.Types.ObjectId, ref: "ImportMapping" },
    filename: { type: String, required: true },
    totalRows: { type: Number, default: 0 },
    importedRows: { type: Number, default: 0 },
    skippedRows: { type: Number, default: 0 },   // duplicates
    errorRows: { type: Number, default: 0 },
    status: { type: String, enum: ["preview", "completed", "failed"], default: "preview" },
    errors: [{ row: Number, message: String }],
  },
  { timestamps: true }
);

const ImportHistory = mongoose.model("ImportHistory", importHistorySchema);
export default ImportHistory;
