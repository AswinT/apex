/**
 * User Schema for Apex E-commerce
 * Handles user authentication and authorization
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true, 
    match: [/.+\@.+\..+/, 'Please fill a valid email address'] 
  },
  phone: { 
    type: String, 
    required: false, 
    unique: true, 
    sparse: true 
  },
  password: { 
    type: String, 
    required: function() { 
      return !this.googleId && !this.facebookId; 
    }
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  facebookId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

/**
 * Pre-save middleware to hash password if modified
 * and update the updatedAt timestamp
 */
userSchema.pre('save', async function(next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    // Still update the updatedAt timestamp
    user.updatedAt = Date.now();
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password along with the new salt
    user.password = await bcrypt.hash(user.password, salt);
    
    // Update the updatedAt timestamp
    user.updatedAt = Date.now();
    
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare password for login
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);

module.exports = User;
