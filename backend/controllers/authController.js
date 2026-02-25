const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTP } = require('../services/emailService');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configuration for the HttpOnly Cookie
const cookieOptions = {
    httpOnly: true, // Prevents client-side JS from reading the cookie (XSS protection)
    secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
    sameSite: 'Lax', // Protects against CSRF
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const otpCode = generateOTP();
        
        const user = await User.create({
            name,
            email,
            password,
            otp: { code: otpCode, expiresAt: Date.now() + 10 * 60 * 1000 }
        });

        await sendOTP(email, otpCode);
        console.log(`\n[AUTH DEBUG] OTP for ${email} is: ${otpCode}\n`);

        res.status(201).json({ message: "OTP sent to email" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp?.code !== code || user.otp?.expiresAt < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined;
        await user.save();
        res.json({ message: "Verified successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // select('+password') is needed because it's hidden in the Schema
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        if (!user.isVerified) {
            return res.status(403).json({ error: "Please verify your email first" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // Send token in an HttpOnly cookie
        res.cookie('token', token, cookieOptions);

        res.json({ 
            message: "Login successful", 
            role: user.role, 
            name: user.name 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logoutUser = (req, res) => {
    // Clear the cookie by setting it to an empty value and expiring it immediately
    res.clearCookie('token', { ...cookieOptions, maxAge: 0 });
    res.json({ message: "Logged out successfully" });
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const otpCode = generateOTP();
        user.otp = { code: otpCode, expiresAt: Date.now() + 10 * 60 * 1000 };
        await user.save();
        
        await sendOTP(email, otpCode);
        console.log(`\n[AUTH DEBUG] Forgot Password OTP: ${otpCode}\n`);
        
        res.json({ message: "OTP sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || user.otp?.code !== otp || user.otp?.expiresAt < Date.now()) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        user.password = newPassword;
        user.otp = undefined;
        await user.save();
        
        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCurrentUser = async (req, res) => {
    // req.user is populated by the 'protect' middleware
    res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ error: "Current password incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};