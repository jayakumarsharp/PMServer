import mongoose from "mongoose";

// Stores API keys / tokens per broker per user.
// In production these should be encrypted at rest.
const brokerCredentialSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    broker: {
      type: String,
      enum: ["upstox", "fyers", "zerodha", "angel", "5paisa"],
      required: true,
    },
    apiKey: { type: String },
    apiSecret: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
    tokenExpiry: { type: Date },
    isActive: { type: Boolean, default: true },
    lastSyncedAt: { type: Date },
    syncStatus: { type: String, enum: ["idle", "syncing", "error", "success"], default: "idle" },
    syncError: { type: String },
  },
  { timestamps: true }
);

brokerCredentialSchema.index({ userId: 1, broker: 1 }, { unique: true });

const BrokerCredential = mongoose.model("BrokerCredential", brokerCredentialSchema);
export default BrokerCredential;
