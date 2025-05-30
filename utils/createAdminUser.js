/**
 * Utility script to create an initial admin user
 * Run this script with: node utils/createAdminUser.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // bcrypt is not directly used here anymore
const User = require('../models/userSchema');

// Admin user details
const adminUser = {
  username: 'admin',
  email: 'admin@apex.com',
  password: 'Admin@123', // Plain password
  isAdmin: true
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      console.log('Connected to MongoDB');

      // Check if admin user already exists
      const existingAdmin = await User.findOne({ email: adminUser.email });

      if (existingAdmin) {
        console.log('Admin user already exists. Resetting password...');
        existingAdmin.password = adminUser.password; // Set plain password
        await existingAdmin.save(); // pre('save') hook in userSchema will hash it
        console.log('Admin password has been reset.');
      } else {
        // Create the admin user with the PLAIN password
        const newAdmin = new User({
          username: adminUser.username,
          email: adminUser.email,
          password: adminUser.password, // Use the plain password
          isAdmin: adminUser.isAdmin
        });

        // Save the admin user (pre('save') hook in userSchema will hash it)
        await newAdmin.save();
        console.log('Admin user created successfully');
      }

      console.log('Email:', adminUser.email);
      console.log('Password (to use for login):', adminUser.password);

      process.exit(0);
    } catch (error) {
      console.error('Error creating/updating admin user:', error);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });