/**
 * User Routes for Apex E-commerce
 * Handles all user-related routes including authentication
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/user/authController');
const productController = require('../controllers/user/productController');
const { noCacheHeaders } = require('../middlewares/cacheControlMiddleware');

// Apply no-cache headers to authentication-related routes
router.use(['/login', '/signup', '/verify-otp', '/forgot-password', '/reset-password', '/account', '/logout'], noCacheHeaders);

// Signup routes
router.get('/signup', authController.renderSignupPage);
router.post('/signup', authController.processSignup);

// OTP verification routes
router.get('/verify-otp', authController.renderVerifyOtpPage);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);

// Login and logout routes
router.get('/login', authController.renderLoginPage);
router.post('/login', authController.processLogin);
router.get('/logout', authController.logoutUser);

// Password reset routes
router.get('/forgot-password', authController.renderForgotPasswordPage);
router.post('/forgot-password', authController.sendPasswordResetLink);
router.get('/reset-password/:token', authController.renderResetPasswordPage);
router.post('/reset-password/:token', authController.resetPassword);

// Product routes
router.get('/', productController.renderHomePage);
router.get('/headphones', productController.listUserProducts);
router.get('/headphones/:productId', productController.showProductDetails);

// Redirect /product/:productId to /headphones/:productId
router.get('/product/:productId', (req, res) => {
  res.redirect(`/headphones/${req.params.productId}`);
});

// Account routes
router.get('/account', authController.isAuthenticated, authController.renderAccountPage);

module.exports = router;
