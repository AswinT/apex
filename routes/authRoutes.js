const express = require('express');
const passport = require('passport');
const router = express.Router();

// @route   GET /auth/google
// @desc    Authenticate with Google
// @access  Public
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// @route   GET /auth/google/callback
// @desc    Google auth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    // Successful authentication
    // Check if this is a new user
    const isNewUser = req.user.createdAt && 
                     ((new Date() - new Date(req.user.createdAt)) / 1000) < 10;
    
    // Redirect based on new or existing user
    if (isNewUser) {
      req.flash('success_msg', 'Account successfully created with Google!');
    } else {
      req.flash('success_msg', 'Successfully logged in with Google!');
    }
    
    // Redirect to the homepage instead of dashboard
    res.redirect('/');
  }
);

module.exports = router;
