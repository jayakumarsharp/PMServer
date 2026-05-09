import mongoose from "mongoose";

const dividendSchema = new mongoose.Schema(
  {
    portfolio_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
    },
    security_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SecurityMaster",
      required: true,
    },
    amount_per_share: { type: Number, required: true, min: 0 },
    shares_held: { type: Number, required: true, min: 0 },
    total_amount: { type: Number },
    currency: { type: String, uppercase: true, default: "INR" },
    ex_date: { type: Date, required: true },
    pay_date: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

dividendSchema.pre("save", function (next) {
  this.total_amount = +(this.amount_per_share * this.shares_held).toFixed(4);
  next();
});

const Dividend = mongoose.model("Dividend", dividendSchema);
export default Dividend;
