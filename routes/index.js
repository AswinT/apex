/**
 * Main routes for Apex e-commerce website
 */
const express = require('express');
const router = express.Router();
const productController = require('../controllers/user/productController');

// Home page route
router.get('/', productController.renderHomePage);

// About page route
router.get('/about', (req, res) => {
  res.render('user/about', { 
    title: 'About Apex Headphones',
    user: req.session.user || null
  });
});

// Contact page route
router.get('/contact', (req, res) => {
  res.render('user/contact', { 
    title: 'Contact Apex Headphones',
    user: req.session.user || null
  });
});

module.exports = router;
