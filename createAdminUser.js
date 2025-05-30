/**
 * Script to create an admin user in the database
 * Run with: node createAdminUser.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userSchema');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apex_db';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB for admin user creation');
    createAdminUser();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@apex.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Setting password...');
      existingAdmin.password = 'Admin@123';
      await existingAdmin.save();
      console.log('Admin password has been reset');
    } else {
      // Create a new admin user
      const adminUser = new User({
        username: 'Admin',
        email: 'admin@apex.com',
        password: 'Admin@123',
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    }
    
    console.log('\nAdmin Login Credentials:');
    console.log('Email: admin@apex.com');
    console.log('Password: Admin@123');
    
    // Disconnect from MongoDB
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}
