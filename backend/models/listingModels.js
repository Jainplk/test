/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviewModels.js");
const Chat = require("./chatModels.js");
const Message = require("./messageModels.js"); // Import the Message model

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location:{
    type: String,
    required: true,
  },
  coordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required:true}, // [longitude, latitude]
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }  
});

listingSchema.index({ owner: 1 });

listingSchema.pre("findOneAndDelete", async function (next) {
  const query = this._conditions; // Get the query conditions
  console.log("Query from pre delete:", query);

  const listingId = query._id;
  console.log("Listing ID from pre delete:", listingId);

  if (!listingId) {
    return next(new Error("Listing ID not found in query"));
  }

  try {
    // Fetch the listing to get the reviews array
    const listing = await mongoose.model("Listing").findById(listingId).select("reviews");
    if (!listing) {
      console.log("Listing not found!");
      return next();
    }

    const reviewIds = listing.reviews; // Get all review IDs from listing
    console.log("Reviews to delete:", reviewIds);

    // Delete all associated reviews
    if (reviewIds.length > 0) {
      await Review.deleteMany({ _id: { $in: reviewIds } });
      console.log("Reviews deleted successfully.");
    } else {
      console.log("No reviews found.");
    }

    // Find all chats related to this listing
    const chats = await Chat.find({ listingId: listingId }, "_id");
    const chatIds = chats.map((chat) => chat._id);

    console.log("Chat IDs to delete:", chatIds);

    // Delete all messages linked to these chats
    if (chatIds.length > 0) {
      await Message.deleteMany({ chatId: { $in: chatIds } });
      await Chat.deleteMany({ _id: { $in: chatIds } });
      console.log("Chats and messages deleted successfully.");
    } else {
      console.log("No chats found for this listing.");
    }

    console.log("Deleted reviews, messages, and chats for listing:", listingId);
  } catch (error) {
    console.error("Error in pre-delete middleware:", error);
    return next(error);
  }

  next();
});


const Listing =  mongoose.models.Listing || mongoose.model("Listing", listingSchema);
module.exports = Listing;
