/**
 * Admin Routes for Apex E-commerce
 * Handles all admin-related routes
 */
const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/admin/adminAuthController');
const userManagementController = require('../controllers/admin/userManagementController');
const categoryController = require('../controllers/admin/categoryController');
const productController = require('../controllers/admin/productController');
const { isAdminAuthenticated } = require('../middlewares/authMiddleware');
const { upload, handleMulterError } = require('../middlewares/uploadMiddleware');
const { noCacheHeaders } = require('../middlewares/cacheControlMiddleware');

// Apply no-cache headers to all admin routes
router.use(noCacheHeaders);

// Admin authentication routes
router.get('/login', adminAuthController.renderAdminLoginPage);
router.post('/login', adminAuthController.processAdminLogin);
router.get('/logout', adminAuthController.logoutAdmin);

// Admin dashboard route (protected)
router.get('/dashboard', isAdminAuthenticated, adminAuthController.renderDashboard);

// Define product routes FIRST to ensure they take precedence
// Product management routes (protected)
router.get('/products', isAdminAuthenticated, productController.listProducts);
router.get('/products/add', isAdminAuthenticated, productController.renderAddProductForm);
router.post('/products/add', isAdminAuthenticated, upload.array('productImages', 5), handleMulterError, productController.addProduct);
router.get('/products/edit/:productId', isAdminAuthenticated, productController.renderEditProductForm);
router.post('/products/edit/:productId', isAdminAuthenticated, upload.array('productImages', 5), handleMulterError, productController.updateProduct);
router.post('/products/toggle-list/:productId', isAdminAuthenticated, productController.toggleListProduct);
router.delete('/products/delete/:productId', isAdminAuthenticated, productController.deleteProduct);

// Redirect problematic routes to dashboard
router.get('/orders', isAdminAuthenticated, (req, res) => res.redirect('/admin/dashboard'));
router.get('/profile', isAdminAuthenticated, (req, res) => res.redirect('/admin/dashboard'));
router.get('/settings', isAdminAuthenticated, (req, res) => res.redirect('/admin/dashboard'));

// User management routes (protected)
router.get('/users', isAdminAuthenticated, userManagementController.listUsers);
router.post('/users/toggle-block/:userId', isAdminAuthenticated, userManagementController.toggleBlockUser);

// Category management routes (protected)
router.get('/categories', isAdminAuthenticated, categoryController.listCategories);
router.get('/categories/add', isAdminAuthenticated, categoryController.renderAddCategoryForm);
router.post('/categories/add', isAdminAuthenticated, categoryController.addCategory);
router.get('/categories/edit/:categoryId', isAdminAuthenticated, categoryController.renderEditCategoryForm);
router.post('/categories/edit/:categoryId', isAdminAuthenticated, categoryController.updateCategory);
router.post('/categories/toggle-list/:categoryId', isAdminAuthenticated, categoryController.toggleListCategory);
router.delete('/categories/delete/:categoryId', isAdminAuthenticated, categoryController.deleteCategory);

module.exports = router;
