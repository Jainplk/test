const User = require('../models/userModels');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {sendWelcomeMail, sendOtpMail, resetPasswordOtp} = require('../config/nodemailer');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// register Function
module.exports.register = async(req, res) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'})
    }

    if(!emailRegex.test(email)){
        return res.json({success: false, message: 'Invalid Email'}) 
    }

    if(password.length < 8){
        return res.json({success: false, message: 'Password must be at least 8 characters'})
    }
        const exitingUser = await User.findOne({email})
        if(exitingUser){
            return res.json({success:false, message: "User already exits"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({name, email, password:hashedPassword})
        await user.save();



        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await sendWelcomeMail(email, name)

        return res.json({success:true, message:"Registration successful!"})
}

// Login function
module.exports.login = async(req, res) => {
        const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: 'Email and Password are required!'})
    }

    if(!emailRegex.test(email)){
        return res.json({success: false, message: 'Invalid Email'}) 
    }

    if(password.length < 8){
        return res.json({success: false, message: 'Password must be at least 8 characters'})
    }
        const user = await User.findOne({email})

        if(!user){
            return res.json({success: false, message: 'Inavlid Email'}) 
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({success: false, message: 'Invalid Password'})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({success:true, message: "Login Successfully!", token, userId:user._id})
}

// logout function
module.exports.logout = async(req, res) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',   
        })

        return res.json({success:true, message: 'Logged Out'})
}

// send otp to verify
module.exports.sendverifyOtp = async(req, res) => {
        const user = await User.findById(req.userId);

        if(user.isAccountVerified){
            return res.json({success:false, message: "Account Already verify"})
        }

        const opt = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = opt;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        await sendOtpMail(user.email, user.verifyOtp)

        return res.json({success:true, message: "Verification OTP sent on Email"})

}

// check if user is authenticate or not
module.exports.isAuthenticate = async (req, res) => {
    try {
        return res.json({success:true,})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}

// verify email
module.exports.verifyEmail = async(req, res) => {
    
    const {otp} = req.body;

    if(!req.userId || !otp){
        return res.json({success:false, message:"Missing Details"})
    }
        const user = await User.findById(req.userId);

        if(!user){
            return res.json({success:false, message:"User not Found"})
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false, message:"Invalid OTP"})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false, message:"OTP Expired"})
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0

        await user.save()

        return res.json({success:true, message:"Email Verified Succesfully"})
}

// send Passwor reset otp
module.exports.sendResetOtp = async(req, res) => {
    const {email} = req.body;

    if(!email){
        return res.json({success:false, message:"Email is required"})
    }
        
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false, message:"User not Found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt =  Date.now() + 15 * 60 * 1000;

        await user.save();

        await resetPasswordOtp(user.email, user.resetOtp)

        return res.json({success:true, message: "OTP sent to your email"})
}

// verify otp and reset password
module.exports.resetPassword = async(req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success:false, message: "Email, OTP and Password are required"})
    }
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false, message: "User not Found"})
        }

        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success:false, message: "Invalid OTP"})
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false, message: "OTP Expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save()

        return res.json({success:true, message: "Password has been reset Succefully"})

}

