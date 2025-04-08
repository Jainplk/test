const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        chatId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chat", // Reference to the Chat schema
          required: true,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Message sender (guest or host)
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
      { timestamps: true }
)

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
module.exports = Message;