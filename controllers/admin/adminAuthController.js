/**
 * Admin Authentication Controller for Apex E-commerce
 * Handles admin login, dashboard, and authentication
 */
const bcrypt = require('bcrypt');
const User = require('../../models/userSchema');

/**
 * Renders the admin login page
 */
const renderAdminLoginPage = (req, res) => {
  try {
    res.render('admin/login', {
      title: 'Admin Login - Apex Headphones',
      error: null
    });
  } catch (error) {
    console.error('Error rendering admin login page:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Processes admin login
 * Validates admin credentials and creates admin session
 */
const processAdminLogin = async (req, res) => {
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
    
    // Check if user exists and is admin
    if (!user || !user.isAdmin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
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

    // Set admin session
    req.session.user = {
      id: user._id,
      username: user.username,
      isAdmin: true
    };

    // Respond with success
    return res.status(200).json({ 
      success: true, 
      message: 'Admin login successful',
      redirect: '/admin/dashboard' 
    });
  } catch (error) {
    console.error('Error processing admin login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Renders the admin dashboard
 * Protected by isAdminAuthenticated middleware
 */
const renderDashboard = (req, res) => {
  try {
    res.render('admin/dashboard', {
      title: 'Admin Dashboard - Apex Headphones',
      user: req.session.user
    });
  } catch (error) {
    console.error('Error rendering admin dashboard:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Logs out the admin by destroying the session
 */
const logoutAdmin = (req, res) => {
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
      
      // Redirect to admin login page
      res.redirect('/admin/login');
    });
  } catch (error) {
    console.error('Error logging out admin:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  renderAdminLoginPage,
  processAdminLogin,
  renderDashboard,
  logoutAdmin
};
