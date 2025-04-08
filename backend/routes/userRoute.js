const express = require('express');
const userAuth = require('../middleware/userAuth');
const wrapAsync = require('../utils/wrapAsync');
const { getUserData, updateUserProfile, destroyProfile } = require('../controllers/userController');
const multer = require('multer');
const { userProfileStorage } = require('../config/cloudConfig');
const upload = multer({storage: userProfileStorage})

const router = express.Router();

router.get('/data', userAuth, wrapAsync(getUserData));

router.put('/update-profile' ,userAuth, upload.single('profileImg'), wrapAsync(updateUserProfile))

router.delete('/delete-profile',userAuth, wrapAsync(destroyProfile))
 
module.exports = router;