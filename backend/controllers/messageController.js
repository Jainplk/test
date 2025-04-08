const Chat = require("../models/chatModels");
const Message = require("../models/messageModels");

module.exports.createMsg = async (req, res) => {
    const { chatId, text} = req.body;
    const senderId = req.userId;
    console.log("from createmsg", req.body)

    if(!chatId || !text){
      return res.json({success:false})
    }

    const chat = await Chat.findById(chatId);

    if(!chat){
      return res.json({success:false, message:"Chat not found"})
    }
 
    const message = new Message({ chatId, senderId, text });
    await message.save();

    res.status(200).json(message);
}

module.exports.getAllMessages = async (req, res) => {
    const chatId = req.params.chatId

    if(!chatId){
      return res.json({success:false, message:"Chat Id is required"})
    }

    const messages = await Message.find({ chatId }).sort("createdAt");

    console.log("messages from backend", messages)
    console.log("chatId: req.params.chatId", req.params.chatId)

    if (!messages.length) {
      console.log("No messages found for chatId:", req.params.chatId);
      return res.json({ success:false, message: "No messages found for this chat." });
    }

    res.json({success:true, messages})
}

module.exports.getMessage = async (req, res) => {
    const {userId, ownerId } = req.params;

    console.log(ownerId, userId)

    // Find messages where the user and owner are involved in any order
    const messages = await Message.find({
      $or: [
        { senderId: userId, chatId: ownerId },
        { senderId: ownerId, chatId: userId }
      ]
    }).sort("createdAt");

    res.status(200).json(messages);

};
