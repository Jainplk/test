const mongoose = require("mongoose")
const listingData = require("../data/listingData.js")
const Listing = require("../models/listingModels.js")

mongoose
  .connect("mongodb://127.0.0.1:27017/stayEasy", {
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const initData = async () => {
  try {
    await Listing.deleteMany({}); // Clear existing data
    await Listing.insertMany(listingData); // Insert sample data
    console.log('Initialized Data Successfully');
  } catch (error) {
    console.error('Error importing data:', error);
  }
};

initData();