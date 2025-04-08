const mongoose = require('mongoose');

const mongodb_url = process.env.ATLASDB_URL

const connectDB = async () => {
  try {
    await mongoose.connect(mongodb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log(mongodb_url)
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};


module.exports = connectDB;


