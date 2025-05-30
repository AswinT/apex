/**
 * Apex E-commerce Website
 * Main server file
 */

// Required dependencies
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const { errorMiddleware, notFound } = require('./middlewares/errorMiddleware');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize express application
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 72, // 72 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }
}));

app.use(flash()); // Flash messages middleware

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Load Passport strategies
require('./config/passport')(passport);

// Middleware to make flash messages available in templates
app.use((req, res, next) => {
  res.locals.messages = { // Create a 'messages' object
    success: req.flash('success'), // Assigns an array of success messages
    error: req.flash('error')     // Assigns an array of error messages
  };
  next();
});

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files configuration
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
const indexRoutes = require('./routes/index');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const authRoutes = require('./routes/authRoutes');

// Apply routes
app.use('/', indexRoutes);
app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRoutes);

// 404 handler - Page Not Found
app.use(notFound);

// Central error handler
app.use(errorMiddleware);

// Server setup
const PORT = process.env.PORT || 3000;

// Connect to database before starting the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`MongoDB connected successfully`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();