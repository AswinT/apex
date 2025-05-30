/**
 * OTP Schema for Apex E-commerce
 * Handles email verification during user signup
 */
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '10m' // OTP expires in 10 minutes
  },
  userDetails: {
    username: String,
    password: String, // Changed from hashedPassword to password
    phone: String // Optional
  }
});

// Create an index on email for faster lookups
otpSchema.index({ email: 1 });

// Create the model from the schema and export it
const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;