const mongoose = require('mongoose');
const dns = require('dns');

// Force reliable public DNS so mongodb+srv SRV lookups don't fail on flaky ISP/router DNS.
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Establishes the connection to MongoDB using the URI from environment variables.
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit the process with failure so the container/host can restart it.
    process.exit(1);
  }
};

module.exports = connectDB;
