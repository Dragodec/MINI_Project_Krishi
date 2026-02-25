const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', authController.registerUser);
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.loginUser);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected Routes
router.get('/me', protect, authController.getCurrentUser);
router.post('/logout', authController.logoutUser); // Clears the HttpOnly cookie

module.exports = router;