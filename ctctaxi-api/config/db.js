const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // This line MUST match the Key you set in Render exactly!
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log('✅ MongoDB connected to ctc_taxi');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;