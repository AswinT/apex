/**
 * Authentication Controller for Apex E-commerce
 * Handles user signup, OTP verification, and related functionality
 */
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../../models/userSchema');
const Otp = require('../../models/otpSchema');
const { generateOTP } = require('../../utils/otpGenerator');
const { sendOtpEmail, sendPasswordResetEmail } = require('../../utils/emailService');

/**
 * Renders the signup page
 */
const renderSignupPage = (req, res) => {
  try {
    res.render('user/signup', {
      title: 'Sign Up - Apex Headphones',
      error: null
    });
  } catch (error) {
    console.error('Error rendering signup page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Processes the user signup request
 * Validates inputs, generates OTP, and sends verification email
 */
const processSignup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, phone } = req.body;

    // Validate inputs
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check email format
    const emailRegex = /.+\@.+\..+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save or update OTP document with PLAIN password
    await Otp.findOneAndUpdate(
      { email },
      {
        email,
        otp,
        userDetails: {
          username,
          password, // Store plain password
          phone
        }
      },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendOtpEmail(email, otp);

    // Store email in session for verification
    req.session.signupEmail = email;

    // Respond with success
    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email for verification',
      redirect: '/verify-otp'
    });
  } catch (error) {
    console.error('Error processing signup:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Renders the OTP verification page
 */
const renderVerifyOtpPage = (req, res) => {
  try {
    // Check if email exists in session
    const email = req.session.signupEmail;
    if (!email) {
      return res.redirect('/signup');
    }

    res.render('user/verify-otp', {
      title: 'Verify OTP - Apex Headphones',
      email,
      error: null
    });
  } catch (error) {
    console.error('Error rendering OTP verification page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Verifies the OTP entered by the user
 * Creates the user account if OTP is valid
 */
const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.session.signupEmail;

    // Check if email exists in session
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Session expired. Please sign up again'
      });
    }

    // Find OTP document
    const otpDoc = await Otp.findOne({ email });

    // Check if OTP exists
    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not found. Please request a new OTP'
      });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again'
      });
    }

    // Create new user with PLAIN password from otpDoc
    const newUser = new User({
      username: otpDoc.userDetails.username,
      email: email,
      password: otpDoc.userDetails.password, // This is now the plain password
      phone: otpDoc.userDetails.phone
    });

    // Save the user (pre('save') hook in userSchema will hash the plain password)
    await newUser.save();

    // Delete OTP document
    await Otp.deleteOne({ email });

    // Clear signup email from session
    delete req.session.signupEmail;

    // Set user session
    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      isAdmin: newUser.isAdmin
    };

    // Respond with success
    return res.status(200).json({
      success: true,
      message: 'Account verified successfully',
      redirect: '/'
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Resends OTP to the user's email
 */
const resendOtp = async (req, res) => {
  try {
    const email = req.session.signupEmail;

    // Check if email exists in session
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Session expired. Please sign up again'
      });
    }

    // Find existing OTP document
    const existingOtp = await Otp.findOne({ email });

    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: 'Previous signup details not found. Please sign up again'
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Update OTP document
    existingOtp.otp = otp;
    await existingOtp.save();

    // Send new OTP email
    await sendOtpEmail(email, otp);

    // Respond with success
    return res.status(200).json({
      success: true,
      message: 'New OTP sent to your email'
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Renders the login page
 */
const renderLoginPage = (req, res) => {
  try {
    res.render('user/login', {
      title: 'Login - Apex Headphones',
      error: null
    });
  } catch (error) {
    console.error('Error rendering login page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Processes user login
 * Validates credentials and creates user session
 */
const processLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Set user session
    req.session.user = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    };

    // Respond with success
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      redirect: '/'
    });
  } catch (error) {
    console.error('Error processing login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Logs out the user by destroying the session
 */
const logoutUser = (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({
          success: false,
          message: 'Error logging out'
        });
      }

      // Clear the cookie
      res.clearCookie('connect.sid');

      // Redirect to home page
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Renders the forgot password page
 */
const renderForgotPasswordPage = (req, res) => {
  try {
    res.render('user/forgot-password', {
      title: 'Forgot Password - Apex Headphones',
      error: null
    });
  } catch (error) {
    console.error('Error rendering forgot password page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Processes the forgot password request
 * Generates a reset token and sends an email with reset link
 */
const sendPasswordResetLink = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, send a generic success response to prevent email enumeration
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If a user with that email exists, a password reset link has been sent.'
      });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing it
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set the token and expiry on the user document
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now

    // Save the user document
    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken, resetUrl);

    // Send response
    res.status(200).json({
      success: true,
      message: 'If a user with that email exists, a password reset link has been sent.'
    });
  } catch (error) {
    console.error('Error sending password reset link:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Renders the reset password page
 */
const renderResetPasswordPage = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with this token and check if token is still valid
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // If token is invalid or expired
    if (!user) {
      return res.render('user/reset-password-error', {
        title: 'Invalid or Expired Token - Apex Headphones',
        message: 'Password reset token is invalid or has expired.'
      });
    }

    // Render reset password page
    res.render('user/reset-password', {
      title: 'Reset Password - Apex Headphones',
      token,
      error: null
    });
  } catch (error) {
    console.error('Error rendering reset password page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Processes the password reset
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Validate passwords
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both password fields are required'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Simple password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Hash the token from the URL
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with this token and check if token is still valid
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // If token is invalid or expired
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token and expiry
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    // Update the updatedAt timestamp
    user.updatedAt = Date.now();

    // Save the user with new password
    await user.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
      redirect: '/login'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Authentication middleware to protect routes
 * Redirects to login page if user is not authenticated
 */
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  // Save the requested URL to redirect back after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};

/**
 * Renders the user account page
 * Protected by isAuthenticated middleware
 */
const renderAccountPage = async (req, res) => {
  try {
    // Get the current user from session
    const userId = req.session.user.id;

    // Fetch the user details from database
    const user = await User.findById(userId).select('-password');

    if (!user) {
      // Log the user out if user no longer exists
      req.session.destroy();
      return res.redirect('/login');
    }

    // Render the account page
    res.render('user/account', {
      title: 'My Account - Apex Headphones',
      user: user,
      orders: [] // Will be implemented in future
    });
  } catch (error) {
    console.error('Error rendering account page:', error);
    res.status(500).render('user/error', {
      title: 'Error - Apex Headphones',
      message: 'An error occurred while loading your account. Please try again later.',
      user: req.session.user || null
    });
  }
};

module.exports = {
  renderSignupPage,
  processSignup,
  renderVerifyOtpPage,
  verifyOtp,
  resendOtp,
  renderLoginPage,
  processLogin,
  logoutUser,
  renderForgotPasswordPage,
  sendPasswordResetLink,
  renderResetPasswordPage,
  resetPassword,
  isAuthenticated,
  renderAccountPage
};