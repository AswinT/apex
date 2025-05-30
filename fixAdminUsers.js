/**
 * Script to fix all admin users in the database
 * Run with: node fixAdminUsers.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userSchema');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apex_db';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB for admin user fix');
    fixAdminUsers();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function fixAdminUsers() {
  try {
    // Find all admin users
    const adminUsers = await User.find({ isAdmin: true });
    
    if (adminUsers.length === 0) {
      console.log('No admin users found in the database.');
    } else {
      console.log(`Found ${adminUsers.length} admin users. Fixing them...`);
      
      for (const user of adminUsers) {
        // Only process if the user isn't the default admin
        if (user.email !== 'admin@apex.com') {
          console.log(`Fixing admin user: ${user.email}`);
          
          // Generate proper password hash
          const salt = await bcrypt.genSalt(10);
          // Use their email as a simple password for testing
          const password = user.email.split('@')[0] + '@123';
          const hashedPassword = await bcrypt.hash(password, salt);
          
          // Update user with properly hashed password
          user.password = hashedPassword;
          await user.save();
          
          console.log(`Fixed admin user: ${user.email}`);
          console.log(`New password: ${password}`);
        }
      }
      
      console.log('\nAll admin users have been fixed!');
      console.log('For each admin user, the password is now: [username]@123');
      console.log('For example, if email is john@example.com, the password is john@123');
    }
    
    // Disconnect from MongoDB
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing admin users:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}
