/** @format */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Listing = require("./listingModels.js");
const Chat = require("./chatModels.js"); 
const Message = require("./messageModels.js"); 
const Review = require("./reviewModels.js"); 
const cloudinary = require("cloudinary").v2;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  about: {
    type: String,
    default: "Hi! I'm a passionate traveler and explorer who loves discovering new places, trying different cuisines, and meeting amazing people. Always learning, growing, and chasing adventures. Let's connect and explore!",
  },
  profileImg: {
    url: {
      type: String,
      default: "",
    },
    filename: {
      type: String,
      default: "",
    },
  },
  verifyOtp: {
    type: String,
    default: "",
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0,
  },
  joinedAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("findOneAndDelete", async function (next) {
  const query = this._conditions;
  const userId = query._id;

  console.log("User ID from pre delete:", userId);

  if (!userId) {
    return next(new Error("User ID not found in query"));
  }

  try {
    const listings = await Listing.find({ owner: userId });

    for (let listing of listings) {

     
       if (listing.image) {
        const imageUrl = listing.image.url;
        const publicId = imageUrl.split("/").pop().split(".")[0];
        console.log(publicId);
      
        if (!imageUrl && !publicId) {
          return res.json({ success: false, message: "Image not found" });
        }
      
        // delete img from cloudinary
        await cloudinary.uploader.destroy(`stayEasy_assets/${publicId}`);
      }
      
      const reviewIds = listing.reviews || [];
      if (reviewIds.length > 0) {
        await Review.deleteMany({ _id: { $in: reviewIds } });
        console.log(`Deleted ${reviewIds.length} reviews for listing ${listing._id}`);
      }
      const chats = await Chat.find({ listingId: listing._id });
      const chatIds = chats.map(chat => chat._id);

      if (chatIds.length > 0) {
        await Message.deleteMany({ chatId: { $in: chatIds } });
        await Chat.deleteMany({ _id: { $in: chatIds } });
        console.log(`Deleted chats and messages for listing ${listing._id}`);
      }
      await Listing.findByIdAndDelete(listing._id);
    }

    const userChats = await Chat.find({ $or: [{ hostId: userId }, { guestId: userId }] });
    const userChatIds = userChats.map(chat => chat._id);

    if (userChatIds.length > 0) {
      await Message.deleteMany({ chatId: { $in: userChatIds } });
      await Chat.deleteMany({ _id: { $in: userChatIds } });
      console.log("Deleted direct chats and messages for user");
    }
    await Review.deleteMany({ userId });
    console.log("Deleted reviews written by user");

    next();
  } catch (error) {
    console.error("Error in user pre-delete middleware:", error);
    next(error);
  }
});


const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
