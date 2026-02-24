const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"Crop App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Verification Code",
    text: `Your 6-digit OTP is: ${otp}. It expires in 10 minutes.`
  };
  await transporter.sendMail(mailOptions);
};