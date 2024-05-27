
// dbconnection.js
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const mongoURI = 'mongodb://localhost:27017/test'; // Replace 'myapp' with your database name
    await mongoose.connect(mongoURI, {});
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};
export { connectDB};