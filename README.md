# Apex - Premium Headphones E-commerce

Apex is an e-commerce platform specializing in high-quality headphones, offering customers a premium audio experience.

## Features

- User authentication and account management
- Product browsing and searching
- Shopping cart and checkout functionality
- Order management
- Admin dashboard for product and order management

## Technology Stack

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **EJS** - Templating engine
- **CommonJS** - Module system
- **MongoDB** - Database (to be implemented)

## Directory Structure

```
apex/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── middlewares/      # Custom middleware functions
├── models/           # Data models
├── public/           # Static assets (CSS, JS, images)
├── routes/           # Application routes
├── utils/            # Utility functions
├── views/            # EJS templates
│   ├── admin/        # Admin templates
│   └── user/         # User templates
├── .env              # Environment variables
├── package.json      # Project metadata and dependencies
├── README.md         # Project documentation
└── server.js         # Main application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your_secret_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

## License

This project is licensed under the ISC License.
