/**
 * Product Controller for Apex E-commerce Admin Panel
 * Handles product management functionality
 */
const Product = require('../../models/productSchema');
const Category = require('../../models/categorySchema');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const mongoose = require('mongoose'); // For ObjectId validation

// Helper: safely delete a file asynchronously, with retry if EBUSY
function safeUnlink(filePath, retries = 3, delay = 100) {
  return new Promise((resolve) => {
    const attempt = (left) => {
      fs.unlink(filePath, (err) => {
        if (!err) return resolve();
        if (err.code === 'EBUSY' && left > 0) {
          // Retry after delay
          return setTimeout(() => attempt(left - 1), delay);
        }
        // Log but do not throw
        console.error(`Failed to delete file: ${filePath}`, err);
        resolve();
      });
    };
    attempt(retries);
  });
}


// Define the path for product images
const productImagesDir = path.join(__dirname, '../../public/images/products');

// Ensure the product images directory exists
if (!fs.existsSync(productImagesDir)) {
  fs.mkdirSync(productImagesDir, { recursive: true });
}

/**
 * Lists all products with pagination, search, and category filtering
 * Protected by isAdminAuthenticated middleware
 */
const listProducts = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const categoryFilter = req.query.categoryFilter || '';
    const skip = (page - 1) * limit;
    
    // Prepare filter object for search and category filtering
    const filter = { isDeleted: { $ne: true } }; // Filter out soft-deleted products
    
    // Add search filter (name, brand)
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { brand: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ];
    }
    
    // Add category filter if specified
    if (categoryFilter) {
      filter.category = categoryFilter;
    }
    
    // Fetch all categories for the filter dropdown
    const categories = await Category.find({ isListed: true }).sort({ name: 1 });
    
    // Fetch products with pagination, search, and category filtering
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Pagination metadata
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalProducts,
      limit,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    };
    
    // Render the products list view with all data
    res.render('admin/products', {
      title: 'Product Management - Apex Headphones',
      products,
      pagination,
      search,
      categories,
      categoryFilter,
      user: req.session.user
    });
  } catch (error) {
    console.error('Error listing products:', error);
    req.flash('error', 'An error occurred while fetching products');
    
    // Attempt to fetch categories even in error case for the filter dropdown
    let categories = [];
    try {
      categories = await Category.find({ isListed: true }).sort({ name: 1 });
    } catch (categoryError) {
      console.error('Error fetching categories:', categoryError);
    }
    
    res.render('admin/products', {
      title: 'Product Management - Apex Headphones',
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        limit: 10,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      },
      search: '',
      categories,
      categoryFilter: '',
      user: req.session.user
    });
  }
};

/**
 * Renders the add product form
 * Protected by isAdminAuthenticated middleware
 */
const renderAddProductForm = async (req, res) => {
  try {
    // Fetch all listed categories for the dropdown
    const categories = await Category.find({ isListed: true }).sort({ name: 1 });
    
    res.render('admin/add-product', {
      title: 'Add Product - Apex Headphones',
      categories,
      user: req.session.user,
      error: null,
      formData: {}
    });
  } catch (error) {
    console.error('Error rendering add product form:', error);
    req.flash('error', 'An error occurred while loading the form');
    res.redirect('/admin/products');
  }
};

/**
 * Process and save uploaded images
 * @param {Array} files - Array of uploaded files from multer
 * @returns {Array} - Array of processed image paths
 */
const processImages = async (files) => {
  const processedImagePaths = [];
  for (const file of files) {
    const filename = `${Date.now()}-${path.basename(file.filename)}.webp`;
    const outputPath = path.join(productImagesDir, filename);
    // Process image with sharp: resize, format conversion, and compression
    await sharp(file.path)
      .resize(800, null, { withoutEnlargement: true })
      .toFormat('webp', { quality: 80 })
      .toFile(outputPath);
    processedImagePaths.push(`/images/products/${filename}`);
    // Remove the temporary file (async, safe)
    await safeUnlink(file.path);
  }
  return processedImagePaths;
};

/**
 * Adds a new product
 * Protected by isAdminAuthenticated middleware
 */
const addProduct = async (req, res) => {
  try {
    // Extract product details from request body
    const { 
      name, description, brand, category, price, salePrice, 
      stockQuantity, features, specifications 
    } = req.body;
    
    // Basic validation
    if (!name || !description || !brand || !category || !price) {
      return res.render('admin/add-product', {
        title: 'Add Product - Apex Headphones',
        categories: await Category.find({ isListed: true }).sort({ name: 1 }),
        user: req.session.user,
        error: 'Please fill in all required fields',
        formData: req.body
      });
    }
    
    // Validate images
    if (!req.files || req.files.length < 3) {
      return res.render('admin/add-product', {
        title: 'Add Product - Apex Headphones',
        categories: await Category.find({ isListed: true }).sort({ name: 1 }),
        user: req.session.user,
        error: 'Please upload at least 3 product images',
        formData: req.body
      });
    }
    
    // Process the uploaded images
    const processedImagePaths = await processImages(req.files);
    
    // Parse specifications if they exist
    let parsedSpecifications = [];
    if (specifications) {
      // If specifications are sent as JSON string
      if (typeof specifications === 'string') {
        try {
          parsedSpecifications = JSON.parse(specifications);
        } catch (error) {
          console.error('Error parsing specifications:', error);
        }
      } else if (Array.isArray(specifications)) {
        parsedSpecifications = specifications;
      }
    }
    
    // Parse features if they exist
    let parsedFeatures = [];
    if (features) {
      if (typeof features === 'string') {
        // If it's a comma-separated string
        parsedFeatures = features.split(',').map(feature => feature.trim()).filter(Boolean);
      } else if (Array.isArray(features)) {
        parsedFeatures = features.filter(Boolean);
      }
    }
    
    // Create new product
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      brand: brand.trim(),
      category,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : undefined,
      stockQuantity: parseInt(stockQuantity || 0),
      images: processedImagePaths,
      specifications: parsedSpecifications,
      features: parsedFeatures
    });
    
    // Save the product
    await newProduct.save();
    
    // Redirect to products list
    req.flash('success', 'Product added successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error adding product:', error);
    
    // Clean up any uploaded files in case of error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    req.flash('error', 'An error occurred while adding the product');
    res.redirect('/admin/products/add');
  }
};

/**
 * Renders the edit product form
 * Protected by isAdminAuthenticated middleware
 */
const renderEditProductForm = async (req, res) => {
  try {
    const { productId } = req.params;
    

// Fetch product by ID and populate the category
    const product = await Product.findById(productId).populate('category');
    
    // Check if product exists
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    // Fetch all listed categories for the dropdown
    const categories = await Category.find({ isListed: true }).sort({ name: 1 });
    res.render('admin/edit-product', {
      title: 'Edit Product - Apex Headphones',
      product,
      categories,
      user: req.session.user,
      error: null
    });
  } catch (error) {
    console.error('Error rendering edit product form:', error);
    req.flash('error', 'An error occurred while loading the form');
    res.redirect('/admin/products');
  }
};

/**
 * Updates an existing product
 * Protected by isAdminAuthenticated middleware
 */
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    // Validate productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      req.flash('error', 'Invalid product ID');
      return res.redirect('/admin/products');
    }
    
    // Fetch product by ID
    const product = await Product.findById(productId);
    
    // Check if product exists
    if (!product) {
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    // Extract product details from request body
    const { 
      name, description, brand, category, price, salePrice, 
      stockQuantity, features, specifications, existingImages
    } = req.body;
    
    // Basic validation
    if (!name || !description || !brand || !category || !price) {
      const categories = await Category.find({ isListed: true }).sort({ name: 1 });
      return res.render('admin/edit-product', {
        title: 'Edit Product - Apex Headphones',
        product,
        categories,
        user: req.session.user,
        error: 'Please fill in all required fields'
      });
    }
    
    // Process existing images
    let updatedImages = [];
    
    // Handle existing images (if any were kept)
    if (existingImages) {
      // If only one image is kept, it will be a string
      if (typeof existingImages === 'string') {
        updatedImages.push(existingImages);
      } else {
        // If multiple images are kept, it will be an array
        updatedImages = existingImages;
      }
    }
    
    // Process new uploaded images (if any)
    if (req.files && req.files.length > 0) {
      const newProcessedImages = await processImages(req.files);
      updatedImages = [...updatedImages, ...newProcessedImages];
    }
    
    // Ensure we have at least one image
    if (updatedImages.length === 0) {
      const categories = await Category.find({ isListed: true }).sort({ name: 1 });
      return res.render('admin/edit-product', {
        title: 'Edit Product - Apex Headphones',
        product,
        categories,
        user: req.session.user,
        error: 'Product must have at least one image'
      });
    }
    
    // Parse specifications if they exist
    let parsedSpecifications = [];
    if (specifications) {
      // If specifications are sent as JSON string
      if (typeof specifications === 'string') {
        try {
          parsedSpecifications = JSON.parse(specifications);
        } catch (error) {
          console.error('Error parsing specifications:', error);
        }
      } else if (Array.isArray(specifications)) {
        parsedSpecifications = specifications;
      }
    }
    
    // Parse features if they exist
    let parsedFeatures = [];
    if (features) {
      if (typeof features === 'string') {
        // If it's a comma-separated string
        parsedFeatures = features.split(',').map(feature => feature.trim()).filter(Boolean);
      } else if (Array.isArray(features)) {
        parsedFeatures = features.filter(Boolean);
      }
    }
    
    // Update product fields
    product.name = name.trim();
    product.description = description.trim();
    product.brand = brand.trim();
    product.category = category;
    product.price = parseFloat(price);
    product.salePrice = salePrice ? parseFloat(salePrice) : undefined;
    product.stockQuantity = parseInt(stockQuantity || 0);
    product.images = updatedImages;
    product.specifications = parsedSpecifications;
    product.features = parsedFeatures;
    
    // Save the updated product
    await product.save();
    
    // Remove any images that were removed from the product
    // This compares the original product images with the updated images list
    const removedImages = product.images.filter(img => !updatedImages.includes(img));
    
    // Delete removed image files from the server
    for (const imagePath of removedImages) {
      const fullPath = path.join(__dirname, '../../public', imagePath);
      if (fs.existsSync(fullPath)) {
        await safeUnlink(fullPath);
      }
    }
    
    // Redirect to products list
    req.flash('success', 'Product updated successfully');
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Clean up any uploaded files in case of error
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    req.flash('error', 'An error occurred while updating the product');
    res.redirect(`/admin/products/edit/${req.params.productId}`);
  }
};

/**
 * Toggles the listed status of a product (soft delete/unlist)
 * Protected by isAdminAuthenticated middleware
 */
const toggleListProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find product by ID
    const product = await Product.findById(productId);
    
    // Check if product exists
    if (!product) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(404).json({ 
          success: false, 
          message: 'Product not found' 
        });
      }
      
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    // Toggle isListed status
    product.isListed = !product.isListed;
    
    // Save the updated product
    await product.save();
    
    const action = product.isListed ? 'listed' : 'unlisted';
    
    // Respond based on request type
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(200).json({ 
        success: true, 
        message: `Product has been ${action} successfully`,
        isListed: product.isListed,
        productId: product._id
      });
    }
    
    // Redirect to products list for non-AJAX requests
    req.flash('success', `Product has been ${action} successfully`);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Error toggling product listed status:', error);
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(500).json({ 
        success: false, 
        message: 'An error occurred. Please try again.' 
      });
    }
    
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/admin/products');
  }
};

/**
 * Delete a product
 */
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      req.flash('error', 'Product not found');
      return res.redirect('/admin/products');
    }
    
    // Delete product images from cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        // Extract public_id from the URL
        const publicId = imageUrl.split('/').pop().split('.')[0];
        if (publicId) {
          try {
            // Delete from cloudinary
            // This is commented out as cloudinary integration might be implemented differently
            // await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error('Error deleting image from cloudinary:', err);
            // Continue with product deletion even if image deletion fails
          }
        }
      }
    }
    
    // Soft delete the product by marking it as unlisted and hidden
    product.isListed = false;
    product.isDeleted = true; // Assuming you have this field in your schema
    await product.save();
    
    // Check if this is an AJAX request or if client expects JSON
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    
    req.flash('success', 'Product deleted successfully');
    return res.redirect('/admin/products');
  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'An error occurred while deleting the product' });
    }
    
    req.flash('error', 'An error occurred while deleting the product');
    return res.redirect('/admin/products');
  }
};

module.exports = {
  listProducts,
  renderAddProductForm,
  addProduct,
  renderEditProductForm,
  updateProduct,
  toggleListProduct,
  deleteProduct
};
