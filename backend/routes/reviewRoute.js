const express = require("express");
const { createReview, destroyReview } = require("../controllers/reviewController");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const userAuth = require("../middleware/userAuth.js")

router.post("/:id/reviews", userAuth ,wrapAsync(createReview));

router.delete("/:listingId/reviews/:reviewId", userAuth , wrapAsync(destroyReview))

module.exports = router;