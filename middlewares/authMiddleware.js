/**
 * Authentication Middleware for Apex E-commerce
 * Provides middleware functions to protect routes based on authentication status
 */

/**
 * Middleware to check if a user is authenticated
 * Used to protect routes that require user login
 */
const isUserAuthenticated = (req, res, next) => {
  // Check if user session exists
  if (req.session.user) {
    // User is authenticated, proceed to the next middleware/route handler
    return next();
  }

  // Determine response based on request type (API or view)
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    // For AJAX requests or API calls, send JSON response
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
      redirect: '/login'
    });
  } else {
    // For regular requests, redirect to login page
    return res.redirect('/login');
  }
};

/**
 * Middleware to check if a user is authenticated and has admin privileges
 * Used to protect admin routes
 */
const isAdminAuthenticated = (req, res, next) => {
  // Check if user session exists and user is an admin
  if (req.session.user && req.session.user.isAdmin) {
    // User is authenticated and is an admin, proceed to the next middleware/route handler
    return next();
  }

  // Determine response based on request type (API or view)
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    // For AJAX requests or API calls, send JSON response
    return res.status(403).json({
      success: false,
      message: 'Admin privileges required',
      redirect: '/login'
    });
  } else {
    // For regular requests, redirect to login page
    // Could also redirect to a custom 'access denied' page
    return res.redirect('/login');
  }
};

module.exports = {
  isUserAuthenticated,
  isAdminAuthenticated
};
