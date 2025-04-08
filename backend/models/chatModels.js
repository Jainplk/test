const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Message = require("./messageModels.js"); // Import the Message model

const chatSchema = new Schema(
  {
    listingId: {
      type:Schema.Types.ObjectId,
      ref: "Listing", // Reference to the Listing schema
      required: true,
    },
    guestId: {
      type: Schema.Types.ObjectId,
      ref: "User", // The guest who starts the chat
      required: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User", // The host of the listing
      required: true,
    },
  },
  { timestamps: true }
);


const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
module.exports = Chat
