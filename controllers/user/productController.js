/**
 * Product Controller for Apex E-commerce User Interface
 * Handles product listing and details for the user-facing storefront
 */
const Product = require('../../models/productSchema');
const Category = require('../../models/categorySchema');

/**
 * Renders the homepage with featured and new arrival products
 */
const renderHomePage = async (req, res) => {
  try {
    // Fetch featured products (limit to 4)
    const featuredProducts = await Product.find({ isListed: true, isFeatured: true })
      .populate('category', 'name')
      .limit(4);
    
    // Fetch new arrivals (limit to 8)
    const newArrivals = await Product.find({ isListed: true })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(8);
    
    // Render the homepage with the products
    res.render('user/home', {
      title: 'Apex Headphones - Premium Audio Experience',
      featuredProducts,
      newArrivals,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Error rendering homepage:', error);
    res.status(500).render('user/error', {
      title: 'Error - Apex Headphones',
      message: 'An error occurred while loading the homepage. Please try again later.',
      user: req.session.user || null
    });
  }
};

/**
 * Lists products with advanced filtering, sorting, and pagination
 */
const listUserProducts = async (req, res) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sort = req.query.sort || 'newest';
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Build the filter object
    const filter = { isListed: true };
    
    // Add search filter if provided
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { brand: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ];
    }
    
    // Add category filter if provided
    if (category) {
      filter.category = category;
    }
    
    // Add price range filter
    filter.price = { $gte: minPrice, $lte: maxPrice };
    
    // Determine the sort order based on the sort parameter
    let sortOption = {};
    switch (sort) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'name-asc':
        sortOption = { name: 1 };
        break;
      case 'name-desc':
        sortOption = { name: -1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }
    
    // Fetch products based on the filter, sort, and pagination
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    
    // Fetch all listed categories for filter options
    const categories = await Category.find({ isListed: true }).sort({ name: 1 });
    
    // Get price range for the filter
    const priceStats = await Product.aggregate([
      { $match: { isListed: true } },
      { 
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    const priceRange = priceStats.length > 0 
      ? { min: priceStats[0].minPrice, max: priceStats[0].maxPrice }
      : { min: 0, max: 1000 }; // Default range if no products
    
    // Prepare pagination metadata
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
    
    // Render the product listing page
    res.render('user/headphones', {
      title: 'Shop Headphones - Apex Audio',
      products,
      pagination,
      search,
      category,
      sort,
      minPrice: req.query.minPrice || priceRange.min,
      maxPrice: req.query.maxPrice || priceRange.max,
      priceRange,
      categories,
      user: req.session.user || null,
      filters: {
        search,
        category,
        sort,
        minPrice: req.query.minPrice || priceRange.min,
        maxPrice: req.query.maxPrice || priceRange.max
      }
    });
  } catch (error) {
    console.error('Error listing products:', error);
    res.status(500).render('user/error', {
      title: 'Error - Apex Headphones',
      message: 'An error occurred while loading the products. Please try again later.',
      user: req.session.user || null
    });
  }
};

/**
 * Shows detailed view of a specific product
 */
const showProductDetails = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Fetch the product by ID and populate the category
    const product = await Product.findById(productId).populate('category', 'name');
    
    // Check if product exists and is listed
    if (!product || !product.isListed) {
      // Redirect to main product listing with message
      return res.redirect('/headphones?message=Product+not+found+or+unavailable');
    }
    
    // Fetch related products from the same category (excluding current product)
    const relatedProducts = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isListed: true
    })
      .populate('category', 'name')
      .limit(4);
    
    // Render the product detail page
    res.render('user/product-detail', {
      title: `${product.name} - Apex Headphones`,
      product,
      relatedProducts,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Error showing product details:', error);
    res.status(500).render('user/error', {
      title: 'Error - Apex Headphones',
      message: 'An error occurred while loading the product details. Please try again later.',
      user: req.session.user || null
    });
  }
};

module.exports = {
  renderHomePage,
  listUserProducts,
  showProductDetails
};
