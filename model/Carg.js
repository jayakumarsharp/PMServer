// models/Carg.js
import mongoose from 'mongoose';

const cargSchema = new mongoose.Schema({
  securityMaster_id: { type: mongoose.Schema.Types.ObjectId, ref: 'SecurityMaster', required: true },
  year: { type: Number, required: true },
  month: { type: Number, required: true },
  cagr1yr: { type: Number, default: null },
  cagr3yr: { type: Number, default: null },
  cagr5yr: { type: Number, default: null },
  cagr10yr: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Carg = mongoose.model('Carg', cargSchema);
export default Carg;
