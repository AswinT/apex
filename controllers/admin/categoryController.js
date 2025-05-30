/**
 * Category Controller for Apex E-commerce Admin Panel
 * Handles category management functionality
 */
const Category = require('../../models/categorySchema'); // Ensure this path is correct and Category model is properly imported

/**
 * Lists categories with search and pagination
 * Protected by isAdminAuthenticated middleware
 */
const listCategories = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;
    
    // Prepare filter object for search
    const filter = { isDeleted: { $ne: true } }; // Filter out soft-deleted categories
    if (search) {
      filter.name = { $regex: new RegExp(search, 'i') }; // Case-insensitive search
    }

    // --- Start of Debugging console.log statements ---
    console.log('--- Debugging /admin/categories ---');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Session User:', req.session.user ? req.session.user.username : 'No session user');
    console.log('Query Parameters:', req.query);
    console.log('Effective Page:', page);
    console.log('Effective Limit:', limit);
    console.log('Effective Search Term:', search);
    console.log('Calculated Skip:', skip);
    console.log('Filter being used for Category.find():', JSON.stringify(filter));
    // --- End of Debugging console.log statements ---

    // Fetch categories with pagination and search
    const categories = await Category.find(filter)
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .skip(skip)
      .limit(limit);
    
    // --- More Debugging console.log statements ---
    console.log('Categories fetched from DB (first 5 or less):', categories.slice(0, 5).map(c => ({ name: c.name, isListed: c.isListed, id: c._id }))); // Log a snippet of fetched categories
    console.log('Number of categories fetched (for this page):', categories.length);
    // --- End of Debugging console.log statements ---
    
    // Get total count for pagination
    const totalCategories = await Category.countDocuments(filter);

    // --- More Debugging console.log statements ---
    console.log('Total categories count from DB (matching filter):', totalCategories);
    // --- End of Debugging console.log statements ---

    const totalPages = Math.ceil(totalCategories / limit);
    
    // Pagination metadata
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalCategories,
      limit,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null
    };
    
    // Render the categories list view with pagination and search data
    res.render('admin/categories', {
      title: 'Category Management - Apex Headphones',
      categories, // This is what's passed to the template
      pagination,
      search,
      user: req.session.user // Admin user info for the sidebar
    });
  } catch (error) {
    // This block should not be hit if your server logs were clean for this page load as per your last message
    // But if an error occurs now, it will be logged here.
    console.error('--- CRITICAL ERROR in listCategories ---');
    console.error('Error Timestamp:', new Date().toISOString());
    console.error('Error Object:', error);
    req.flash('error', 'An error occurred while fetching categories. Check server logs.'); // More informative flash
    
    // It's important to still provide all necessary variables for the template even in error cases,
    // or the template itself might break.
    res.status(500).render('admin/categories', { // Send a 500 status
      title: 'Category Management - Error',
      categories: [], // Send empty categories on error
      pagination: { // Basic pagination structure
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        limit: parseInt(req.query.limit) || 10,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      },
      search: req.query.search || '',
      user: req.session.user, // Ensure user is passed for layout
      // messages object might be needed if layout expects it universally
      messages: { 
        success: [], 
        error: req.flash('error') // Pass the error flash message
      } 
    });
  }
};

/**
 * Renders the add category form
 * Protected by isAdminAuthenticated middleware
 */
const renderAddCategoryForm = (req, res) => {
  try {
    res.render('admin/add-category', {
      title: 'Add Category - Apex Headphones',
      user: req.session.user,
      error: null, // Assuming 'error' is for form validation feedback, not general page errors
      // messages object might be needed if layout expects it
      messages: { 
          success: req.flash('success'), 
          error: req.flash('error')
      }
    });
  } catch (error) {
    console.error('Error rendering add category form:', error);
    req.flash('error', 'Failed to load the add category page.');
    res.redirect('/admin/dashboard'); // Redirect to a safe page on error
  }
};

/**
 * Adds a new category
 * Protected by isAdminAuthenticated middleware
 */
const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || name.trim() === '') {
      req.flash('error', 'Category name is required.');
      return res.render('admin/add-category', {
        title: 'Add Category - Apex Headphones',
        user: req.session.user,
        error: 'Category name is required', // For direct display if template uses 'error' variable
        formData: { name, description },
        messages: { success: [], error: req.flash('error') } // Pass along the flash message
      });
    }
    
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } 
    });
    
    if (existingCategory) {
      req.flash('error', 'Category with this name already exists.');
      return res.render('admin/add-category', {
        title: 'Add Category - Apex Headphones',
        user: req.session.user,
        error: 'Category with this name already exists',
        formData: { name, description },
        messages: { success: [], error: req.flash('error') }
      });
    }
    
    const newCategory = new Category({
      name: name.trim(),
      description: description ? description.trim() : ''
    });
    
    await newCategory.save();
    
    req.flash('success', 'Category added successfully!');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Error adding category:', error);
    req.flash('error', 'An error occurred while adding the category. Please try again.');
    // In case of error, re-render the form with data and the new flash message
    res.render('admin/add-category', {
      title: 'Add Category - Apex Headphones',
      user: req.session.user,
      error: 'An error occurred. Please try again.', // General error message
      formData: req.body,
      messages: { success: [], error: req.flash('error') }
    });
  }
};

/**
 * Renders the edit category form
 * Protected by isAdminAuthenticated middleware
 */
const renderEditCategoryForm = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      req.flash('error', 'Category not found.');
      return res.redirect('/admin/categories');
    }
    
    res.render('admin/edit-category', {
      title: 'Edit Category - Apex Headphones',
      user: req.session.user,
      category,
      error: null,
      messages: { success: req.flash('success'), error: req.flash('error') }
    });
  } catch (error) {
    console.error('Error rendering edit category form:', error);
    req.flash('error', 'An error occurred while loading the edit form. Please try again.');
    res.redirect('/admin/categories');
  }
};

/**
 * Updates an existing category
 * Protected by isAdminAuthenticated middleware
 */
const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description } = req.body;
    let category = await Category.findById(categoryId); // Use let if re-assigning
    
    if (!category) {
      req.flash('error', 'Category not found.');
      return res.redirect('/admin/categories');
    }
    
    if (!name || name.trim() === '') {
      req.flash('error', 'Category name is required.');
      return res.render('admin/edit-category', {
        title: 'Edit Category - Apex Headphones',
        user: req.session.user,
        category, // Pass original category data back
        error: 'Category name is required',
        messages: { success: [], error: req.flash('error') }
      });
    }
    
    if (name.trim().toLowerCase() !== category.name.toLowerCase()) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
        _id: { $ne: categoryId } 
      });
      
      if (existingCategory) {
        req.flash('error', 'Another category with this name already exists.');
        return res.render('admin/edit-category', {
          title: 'Edit Category - Apex Headphones',
          user: req.session.user,
          category, // Pass original category data back
          error: 'Another category with this name already exists',
          messages: { success: [], error: req.flash('error') }
        });
      }
    }
    
    category.name = name.trim();
    category.description = description ? description.trim() : '';
    // category.updatedAt will be set by pre-save hook in schema
    
    await category.save();
    
    req.flash('success', 'Category updated successfully!');
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Error updating category:', error);
    req.flash('error', 'An error occurred while updating the category.');
    // It's better to fetch category again or use data from req.body if save fails,
    // but redirecting to edit with ID is a common pattern.
    // Ensure the category object sent back to the form reflects attempted changes if possible.
    const categoryToRender = await Category.findById(req.params.categoryId) || req.body; // Fallback
    res.status(500).render('admin/edit-category', {
        title: 'Edit Category - Apex Headphones',
        user: req.session.user,
        category: categoryToRender, // Send the category data back
        error: 'An error occurred. Please try again.', // Error message
        messages: { success: [], error: req.flash('error') }, // Pass current flash
        formData: req.body // Also pass formData if you want to preserve input values
    });
  }
};

/**
 * Toggles the listed status of a category (soft delete/unlist)
 * Protected by isAdminAuthenticated middleware
 */
const toggleListCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      // AJAX request check
      if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(404).json({ 
          success: false, 
          message: 'Category not found' 
        });
      }
      req.flash('error', 'Category not found.');
      return res.redirect('/admin/categories');
    }
    
    category.isListed = !category.isListed;
    await category.save();
    
    const action = category.isListed ? 'listed' : 'unlisted';
    
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(200).json({ 
        success: true, 
        message: `Category has been ${action} successfully.`,
        isListed: category.isListed,
        categoryId: category._id
      });
    }
    
    req.flash('success', `Category has been ${action} successfully.`);
    res.redirect('/admin/categories');
  } catch (error) {
    console.error('Error toggling category listed status:', error);
    const errorMessage = 'An error occurred while toggling category status. Please try again.';
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(500).json({ 
        success: false, 
        message: errorMessage
      });
    }
    req.flash('error', errorMessage);
    res.redirect('/admin/categories');
  }
};

/**
 * Permanently deletes a category
 * Protected by isAdminAuthenticated middleware
 */
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      if (req.xhr || req.headers.accept.includes('application/json')) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      req.flash('error', 'Category not found');
      return res.redirect('/admin/categories');
    }
    
    // Check if category is linked to products before deletion
    // This would require importing the Product model, so commented out for now
    // const linkedProducts = await Product.countDocuments({ category: categoryId });
    // if (linkedProducts > 0) {
    //   if (req.xhr || req.headers.accept.includes('application/json')) {
    //     return res.status(400).json({
    //       success: false,
    //       message: `Cannot delete category: it has ${linkedProducts} product(s) assigned to it. Unlist it instead.`
    //     });
    //   }
    //   req.flash('error', `Cannot delete category: it has ${linkedProducts} product(s) assigned to it. Unlist it instead.`);
    //   return res.redirect('/admin/categories');
    // }
    
    // Soft delete the category by marking it as unlisted and deleted
    category.isListed = false;
    category.isDeleted = true;
    await category.save();
    
    // Check if this is an AJAX request or if client expects JSON
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(200).json({ success: true, message: 'Category deleted successfully' });
    }
    
    req.flash('success', 'Category deleted successfully');
    return res.redirect('/admin/categories');
  } catch (error) {
    console.error('Error deleting category:', error);
    
    if (req.xhr || req.headers.accept.includes('application/json')) {
      return res.status(500).json({ success: false, message: 'An error occurred while deleting the category' });
    }
    
    req.flash('error', 'An error occurred while deleting the category');
    return res.redirect('/admin/categories');
  }
};

module.exports = {
  listCategories,
  renderAddCategoryForm,
  addCategory,
  renderEditCategoryForm,
  updateCategory,
  toggleListCategory,
  deleteCategory
};