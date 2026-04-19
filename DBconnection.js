// dbconnection.js
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./config');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log('MongoDB connected to', MONGODB_URI);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export { connectDB };