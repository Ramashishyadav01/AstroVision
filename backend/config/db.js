const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGO_URI;
    if (!rawUri) {
      throw new Error('MONGO_URI environment variable is not defined.');
    }
    const mongoUri = rawUri.replace(/^["']|["']$/g, '').trim();

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
