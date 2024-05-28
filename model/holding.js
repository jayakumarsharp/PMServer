import mongoose from 'mongoose';


const holdingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  shares_owned: { type: Number, required: true },
  cost_basis: { type: Number, required: true },
  target_percentage: { type: Number, required: true },
  goal: { type: Number, required: true },
  portfolio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true }
});

const Holding = mongoose.model('Holding', holdingSchema);

export default Holding;
