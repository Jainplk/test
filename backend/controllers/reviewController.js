/** @format */

const Listing = require("../models/listingModels.js");
const Review = require("../models/reviewModels.js");

module.exports.createReview = async (req, res) => {
  const { feedback } = req.body;
  const { id } = req.params;
  const userId = req.userId
  console.log("id and feedback", id, feedback);

  if(!feedback) {
    return res.json({ message: "Please provide feedback" });
  }

  const newReview = new Review({ 
    feedback,
    user: userId
  });
  await newReview.save();

  await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview._id } });

  const populatedReview = await Review.findById(newReview._id).populate("user", "name profileImg");

  const io = req.app.get("io");
  io.emit("newReview", populatedReview); // Emit the new review to all connected clients

  return res.json({success: true, message: "Review added successfully", review: newReview});
};

module.exports.destroyReview = async (req, res) => {
  const { listingId, reviewId } = req.params;

  if(!listingId || !reviewId) {
    return res.status(400).json({ message: "Listing ID and Review ID are required" });
  }

  const updateListing = await Listing.findByIdAndUpdate(
    listingId,
    { $pull: { reviews: reviewId  } },
    { new: true }
  );
  await Review.findByIdAndDelete(reviewId);

  const io = req.app.get("io");
  io.emit("deleteReview", reviewId); // Emit the deleted review ID to all connected clients

  return res.json({ success: true, message: "Review deleted successfully", listing: updateListing });
};
