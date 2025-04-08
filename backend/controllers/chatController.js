const Chat = require("../models/chatModels");
const Message = require("../models/messageModels")
const Listing = require("../models/listingModels")

module.exports.createChat = async (req, res) => {
    console.log("req.body inside create chat", req.body);
    console.log("req.userId inside create chat", req.userId);

    const { hostId, listingId } = req.body;
    const guestId = req.userId;

    let chat = await Chat.findOne({ listingId, hostId, guestId });

    if (chat) {
      return res.json({ success: true, chat });
    }

    chat = new Chat({ guestId, hostId, listingId });
    await chat.save();
    
    // Populate guest details for real-time update
    chat = await chat.populate("guestId listingId hostId");

    const io = req.app.get("io");

    // Notify both guest and host in real-time
    io.emit("newChat", chat);

    res.json({ success: true, chat });
};

// module.exports.getHostChats = async (req, res) => {
//     const chats = await Chat.find({ hostId: req.userId });

//     const chatIds = chats.map(chat => chat._id);
//     console.log("chatIds", chatIds);

//     const chatsWithMessages = await Message.find({ chatId: { $in: chatIds } }).distinct("chatId");
//     console.log("chatsWithMessages", chatsWithMessages);

//     const filterChats = await Chat.find({ _id: { $in: chatsWithMessages } })
//       .populate("guestId listingId hostId");

//     if (filterChats.length === 0) {
//       return res.json({ success: false, message: "No ChatList found" });
//     }

//     const io = req.app.get("io");
//     io.emit("chatsList", filterChats);

//     res.json({ success: true, filterChats });
// };

module.exports.getHostChats = async (req, res) => {
    const userId = req.userId;

    const listings = await Listing.find({ owner: userId }, "_id");
    const listingIds = listings.map(listing => listing._id);

    if (!listings.length) {
      return res.json({ success: false, message: "No listings found for this host." });
    }

    const chats = await Chat.find({ listingId: { $in: listingIds } });

    if (!chats.length) {
      return res.json({ success: false, message: "No chats found for your listings." });
    }

    const chatIds = chats.map(chat => chat._id);

    const chatsWithMessages = await Message.find({ chatId: { $in: chatIds } }).distinct("chatId");

    const filterChats = await Chat.find({ _id: { $in: chatsWithMessages } })
      .populate("guestId", "name profileImg")
      .populate("listingId", "title image")

      console.log("filterChats", filterChats);

    if (!filterChats.length) {
      return res.json({ success: false, message: "No chats with messages for your listings." });
    }

    return res.json({ success: true, chats: filterChats });
};

module.exports.getChatDetails = async (req, res) => {

    const { chatId } = req.params;

    // Find chat and populate guest details
    const chat = await Chat.findById(chatId).populate("guestId hostId");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    res.json({success:true, chat});

};

module.exports.destroyChat = async (req, res) => {

    let { chatId } = req.params;
    console.log(chatId);

    let chat = await Chat.findById(chatId);
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }

    // Delete messages first
    await Message.deleteMany({ chatId });

    // Now delete the chat
    chat =  await Chat.findByIdAndDelete(chatId);

    const io = req.app.get("io");
  io.emit("deleteChat", chatId);

    res.json({ success: true, message: "Chat deleted successfully", chat });

};


  

