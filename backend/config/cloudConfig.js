const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'stayEasy_assets',
      allowedFormate: ['jpg', 'jpeg', 'png'],
    },
  });

  const userProfileStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'stayEasy_user_profile',
      allowedFormate: ['jpg', 'jpeg', 'png'],
    },
  });

module.exports = ({
    cloudinary,
    storage,
    userProfileStorage
});