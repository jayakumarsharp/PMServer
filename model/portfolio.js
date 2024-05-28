import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cash: { type: Number, required: true },
  notes: String,
  username: { type: String, required: true },
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
