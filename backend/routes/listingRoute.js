const express = require('express');
const { index, showListing, editListing, destroyListing, createListing, updateListing } = require('../controllers/listingControllers');
const wrapAsync = require("../utils/wrapAsync.js")
const router = express.Router();
const multer = require('multer');
const {storage} = require('../config/cloudConfig.js')
const upload = multer({storage:storage})
const userAuth = require("../middleware/userAuth.js")

router.get("/", wrapAsync(index))

router.post("/", userAuth, upload.single('image'), wrapAsync(createListing))

router.get("/:id/show", wrapAsync(showListing));

router.get("/:id/edit", wrapAsync(editListing));

router.put("/:id", userAuth ,upload.single('image'), wrapAsync(updateListing))

router.delete("/:id",userAuth, wrapAsync(destroyListing));

module.exports = router;