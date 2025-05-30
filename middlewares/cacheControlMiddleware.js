/**
 * Cache Control Middleware for Apex E-commerce
 * Prevents browser caching to ensure pages like login don't remain in cache
 */

/**
 * Middleware to set no-cache headers on responses
 * Prevents browser from caching the pages to avoid back-button issues
 */
const noCacheHeaders = (req, res, next) => {
  // Set headers to prevent caching
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

module.exports = {
  noCacheHeaders
};
