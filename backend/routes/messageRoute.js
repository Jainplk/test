const express = require('express');
const { createMsg, getAllMessages, getMessage } = require('../controllers/messageController');
const userAuth = require('../middleware/userAuth');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")

router.post("/", userAuth, wrapAsync(createMsg))

router.get("/:chatId", userAuth, wrapAsync(getAllMessages))

router.get("/:ownerId/:userId", userAuth, wrapAsync(getMessage))

module.exports = router;