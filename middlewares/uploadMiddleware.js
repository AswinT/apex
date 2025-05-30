/**
 * Upload Middleware for Apex E-commerce
 * Handles file uploads using multer
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const tempDir = path.join(__dirname, '../uploads/temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, tempDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename: timestamp-originalname
    const uniqueFilename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueFilename);
  }
});

// File filter to ensure only images are uploaded
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred during upload
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File too large. Maximum size is 5MB.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: `Upload error: ${err.message}` 
    });
  } else if (err) {
    // A different error occurred
    return res.status(500).json({ 
      success: false, 
      message: err.message || 'An unknown error occurred during upload' 
    });
  }
  next();
};

module.exports = {
  upload,
  handleMulterError
};
