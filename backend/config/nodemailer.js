/** @format */

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports.sendWelcomeMail = async (email, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Welcome to StayEasy – Your Journey Begins Here!`,
    html: `<p>Hii <b>${name}</b>,</p> 
           <p>Welcome to <b>StayEasy</b>! 🎉 We're excited to have you on board.</p>
           <p>With StayEasy, you can easily find unique stays, explore new destinations, and enjoy a hassle-free travel experience.</p>
           <p>If you have any questions, feel free to reach out—we’re here to help! 🚀</p>
           <p><b>Happy Traveling!</b></p>
           <p>– The StayEasy Team</p>`,
  });
};

 module.exports.sendOtpMail =  async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Account Verification OTP`,
    html: `<p>Your <b>OTP</b> is <b>${otp}</b>. Verify your account using this <b>OTP<b/></p>`,
  });
};

module.exports.resetPasswordOtp =  async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Password Reset OTP`,
    html: `<p>Your <b>OTP<b/> for resetting your password is <b>${otp}<b/>. Use this OTP to proceed with resetting your password</p>`,
  });
};



