/** @format */

const User = require("../models/userModels");
const cloudinary = require("cloudinary").v2;

module.exports.getUserData = async (req, res) => {
  console.log("user id from get user", req.userId);

  const user = await User.findById(req.userId);

  if (!req.userId) {
    return res.json({ success: false, message: "User not Found" });
  }

  res.json({
    success: true,
    userData: {
      name: user.name,
      email: user.email,
      isAccountVerified: user.isAccountVerified,
      joinedAt: user.joinedAt,
      about: user.about,
      profileImg: user.profileImg,
    },
  });
};

module.exports.updateUserProfile = async (req, res) => {
  console.log("user ID  id from update user profile", req.userId);

  const user = await User.findById(req.userId);
  console.log("user is", user);
  if (!req.userId) {
    return res.json({ success: false, message: "User not Found" });
  }

  user.about = req.body.about || user.about;
  console.log("new about", req.body.about);

  if (req.file || user?.profileImg?.filename) {


    console.log("inside if", user.profileImg.url);

    let userImgUrl = user.profileImg.url;
    console.log("userImgUrl", userImgUrl);

    const publicId = userImgUrl.split("/").pop().split(".")[0];
    console.log("public Id", publicId);

    await cloudinary.uploader.destroy(`stayEasy_user_profile/${publicId}`);

    let url = req.file.path;
    let filename = req.file.filename;

    user.profileImg = { url, filename };
    console.log(user.profileImg);
    
  }

  let updateProfile = await user.save();
  console.log(updateProfile);
  return res.json({
    success: true,
    message: "Your profile Successfully updated!",
    updateProfile,
  });
};

module.exports.destroyProfile = async (req, res) => {
  let user = await User.findOne({ _id: req.userId });
  console.log("user is", user);
  console.log("user is id", user._id);

  if (!user._id) {
    return res.json({ success: false, message: "User not Found" });
  }

  if (user?.profileImg?.url) {
    let userImgUrl = user.profileImg.url;
    console.log("userImgUrl", userImgUrl);

    const publicId = userImgUrl.split("/").pop().split(".")[0];
    console.log("public Id", publicId);

    await cloudinary.uploader.destroy(`stayEasy_user_profile/${publicId}`);
  }

  await User.findOneAndDelete({ _id: user._id });
  console.log("deleted user");

  return res.json({
    success: true,
    message: "Profile deleted Successfully",
    // user,
  });
};
