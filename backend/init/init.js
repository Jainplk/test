require("dotenv").config({path:"../.env"})
const mongoose = require("mongoose");
const listingData = require("../data/listingData.js");
const Listing = require("../models/listingModels.js");
const User = require("../models/userModels.js");
const userData = require("../data/userData.js");
const bcrypt = require("bcryptjs");

mongoose
  .connect(process.env.ATLASDB_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    }
  )
  .then(() => console.log("MongoDB Connected"))
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

// const initData = async () => {
//   try {
//     const hashedUsers = await Promise.all(
//       userData.map(async (user) => {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(user.password, salt);
//         return { ...user, password: hashedPassword };
//       })
//     );

//     await User.deleteMany({}); // Clear existing data
//     await User.insertMany(hashedUsers); // Insert sample data
//     console.log("Initialized Data Successfully");
//   } catch (error) {
//     console.error("Error importing data:", error);
//   }
// };

initData();
