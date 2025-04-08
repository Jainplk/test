const express = require('express');
const router = express.Router();
const userAuth = require("../middleware/userAuth.js");
const { createChat, getHostChats, getChatDetails, destroyChat, } = require('../controllers/chatController.js');
const wrapAsync = require("../utils/wrapAsync");

router.post("/", userAuth, wrapAsync(createChat));

router.get("/", userAuth, wrapAsync(getHostChats));

router.get("/:chatId/details", userAuth, wrapAsync(getChatDetails));

router.delete("/:chatId", userAuth, wrapAsync(destroyChat));

module.exports = router;