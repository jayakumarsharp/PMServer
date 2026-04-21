import mongoose from "mongoose";

const brokerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    buy_commission: { type: Number, required: true, min: 0, default: 0 },
    sell_commission: { type: Number, required: true, min: 0, default: 0 },
    default_currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      default: "USD",
    },
    notes: { type: String, trim: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// One broker name per user
brokerSchema.index({ user_id: 1, name: 1 }, { unique: true });

const Broker = mongoose.model("Broker", brokerSchema);
export default Broker;
