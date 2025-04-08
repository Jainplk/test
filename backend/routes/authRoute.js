const express = require("express");
const { register, login, logout, sendverifyOtp, verifyEmail, sendResetOtp, resetPassword, isAuthenticate } = require("../controllers/authController");
const wrapAsync = require("../utils/wrapAsync");
const userAuth = require("../middleware/userAuth")
const router = express.Router()

router.post("/register", wrapAsync(register))

router.post("/login", wrapAsync(login));

router.post("/logout", wrapAsync(logout));

router.post("/send-verify-otp",userAuth, wrapAsync(sendverifyOtp))

router.post("/verify-account",userAuth, wrapAsync(verifyEmail)) 

router.get("/is-auth",userAuth, wrapAsync(isAuthenticate))

router.post("/send-reset-otp", wrapAsync(sendResetOtp));

router.post("/reset-password", wrapAsync(resetPassword));

module.exports = router;