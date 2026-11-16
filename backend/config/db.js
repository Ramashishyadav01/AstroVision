const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Connection already in progress — wait for it instead of starting a second one
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      const rawUri = process.env.MONGO_URI;
      if (!rawUri) {
        throw new Error('MONGO_URI environment variable is not defined.');
      }
      const mongoUri = rawUri.replace(/^["']|["']$/g, '').trim();

      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      connectionPromise = null; // Allow retry on next request
      console.error(`MongoDB connection error: ${error.message}`);
      if (!process.env.VERCEL) {
        process.exit(1);
      }
      throw error;
    }
  })();

  return connectionPromise;
};

module.exports = connectDB;
