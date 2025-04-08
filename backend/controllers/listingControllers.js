/** @format */
const Listing = require("../models/listingModels");
const cloudinary = require("cloudinary").v2;
const axios = require("axios");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({}).lean();
  res.json(allListings);
};

module.exports.createListing = async (req, res) => {
  const { title, description, price, country, location } = req.body;
  if (!req.file) {
    return res.json({ success: false, message: "Image file is required" });
  }
  let url = req.file.path;
  let filename = req.file.filename;
  const userId = req.userId;

  // Fetch coordinates from OpenStreetMap API
  const geoResponse = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  );

  if (geoResponse.data.length === 0) {
    return res.json({ success: false, message: "Invalid location" });
  }

  const { lat, lon } = geoResponse.data[0];

  const newListing = new Listing({
    title,
    description,
    price,
    country,
    location,
    coordinates: {
      type: "Point",
      coordinates: [parseFloat(lon), parseFloat(lat)], // MongoDB requires [lon, lat] order
    },
    owner: userId,
    image: { url, filename },
  });

  console.log(newListing, "new listing");

  await newListing.save();

  const io = req.app.get("io");
  io.emit("newListing", newListing); // Emit the new listing to all connected clients

  console.log(console.time("Listing Created"));

  res.json({
    success: true,
    message: "Listing created successfully",
    newListing,
  });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "user" } })
    .populate("owner");
  if (!listing) {
    return res.json({ success: false, message: "Listing not found" });
  }
  return res.json({ success: true, listing });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    return res.json({ success: false, message: "Listing not found" });
  }
  return res.json({ success: true, listing });
};

module.exports.updateListing = async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return res.json({ success: false, message: "Listing not found" });
  }

  listing.title = req.body.title || listing.title;
  listing.description = req.body.description || listing.description;
  listing.price = req.body.price || listing.price;
  listing.country = req.body.country || listing.country;
  listing.location = req.body.location || listing.location;

  if (req.file && listing.image.url) {
    const imageUrl = listing.image.url;
    const publicId = imageUrl.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`stayEasy_assets/${publicId}`);

    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }

  let updateListing = await listing.save();

  const io = req.app.get("io");
  io.emit("updateListing", updateListing);

  return res.json({
    success: true,
    message: "Listing updated successfully",
    listing: updateListing,
  });
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    return res.json({ success: false, message: "Listing not found" });
  }

  // extract img from cloudinary
  const imageUrl = listing.image.url;
  const publicId = imageUrl.split("/").pop().split(".")[0];
  console.log(publicId);

  if (!imageUrl && !publicId) {
    return res.json({ success: false, message: "Image not found" });
  }

  // delete img from cloudinary
  await cloudinary.uploader.destroy(`stayEasy_assets/${publicId}`);

  listing = await Listing.findByIdAndDelete(id);

  const io = req.app.get("io");
  io.emit("deleteListing", listing._id); // Emit the deleted listing to all connected clients

  res.json({ success: true, message: "Listing deleted successfully", listing });
};
