/**
 * User Management Controller for Apex E-commerce Admin Panel
 * Handles user listing, search, and management functions
 */
const User = require('../../models/userSchema');

/**
 * Lists all users with pagination and search functionality
 * Protected by isAdminAuthenticated middleware
 */
const listUsers = async (req, res) => {
  try {
    // Get query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build the query
    let query = { isAdmin: false }; // Exclude admins from the list
    
    // Add search functionality
    if (search) {
      query = {
        ...query,
        $or: [
          { username: { $regex: search, $options: 'i' } }, // Case-insensitive search on username
          { email: { $regex: search, $options: 'i' } }     // Case-insensitive search on email
        ]
      };
    }
    
    // Fetch users with pagination and sorting
    const users = await User.find(query)
      .select('username email phone isBlocked createdAt')
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);
    
    // Render the users list view
    res.render('admin/users', {
      title: 'User Management - Apex Headphones',
      users,
      currentPage: page,
      totalPages,
      totalUsers,
      limit,
      search,
      user: req.session.user // Admin user info for the sidebar
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Toggles the blocked status of a user
 * Protected by isAdminAuthenticated middleware
 */
const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user by ID
    const user = await User.findById(userId);
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Prevent blocking admin users
    if (user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot block admin users' 
      });
    }
    
    // Toggle the blocked status
    user.isBlocked = !user.isBlocked;
    
    // Update the user's updatedAt timestamp
    user.updatedAt = Date.now();
    
    // Save the updated user
    await user.save();
    
    // Determine the action taken for the response message
    const action = user.isBlocked ? 'blocked' : 'unblocked';
    
    // Send success response
    return res.status(200).json({ 
      success: true, 
      message: `User has been ${action} successfully`,
      isBlocked: user.isBlocked,
      userId: user._id
    });
  } catch (error) {
    console.error(`Error toggling user block status: ${error.message}`);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  listUsers,
  toggleBlockUser
};
