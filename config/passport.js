const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');

// Load environment variables
require('dotenv').config();

module.exports = function(passport) {
  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in database
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        // User exists, return the user
        return done(null, user);
      }
      
      // Check if user with same email exists
      user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // User with email exists, update googleId and return
        user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }
      
      // Create a new user
      const newUser = new User({
        username: profile.displayName || profile.name.givenName,
        email: profile.emails[0].value,
        googleId: profile.id,
        // No password required for Google login
      });
      
      // Save the new user
      await newUser.save();
      return done(null, newUser);
      
    } catch (err) {
      console.error('Error in Google auth strategy:', err);
      return done(err, null);
    }
  }));
};
