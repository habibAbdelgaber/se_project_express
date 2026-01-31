# WTWR (What to Wear?) - Backend API

## Overview
This is a RESTful API server for the "What to Wear?" application. It manages users, clothing items, and likes using Express.js and MongoDB.

## Project Structure
```
├── app.js              # Main application entry point
├── controllers/        # Request handlers
│   ├── clothingItems.js
│   └── users.js
├── models/             # Mongoose schemas
│   ├── clothingItem.js
│   └── user.js
├── routes/             # API route definitions
│   ├── clothingItems.js
│   ├── index.js
│   └── users.js
├── utils/              # Utility functions
│   └── errors.js
├── package.json        # Dependencies and scripts
└── replit.md           # This file
```

## API Endpoints
- `GET /` - Health check / API info
- `GET /users` - Get all users
- `GET /users/:userId` - Get user by ID
- `POST /users` - Create a new user
- `GET /items` - Get all clothing items
- `GET /items/:itemId` - Get one clothing item
- `POST /items` - Create a new clothing item
- `DELETE /items/:itemId` - Delete a clothing item
- `PUT /items/:itemId/likes` - Like an item
- `DELETE /items/:itemId/likes` - Remove like

## Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (required for database operations)

## Setup
1. Set the `MONGODB_URI` environment variable to your MongoDB connection string (e.g., MongoDB Atlas)
2. Run `npm install` to install dependencies
3. Run `npm run dev` for development or `npm start` for production

## Technologies
- Node.js with Express.js
- MongoDB with Mongoose ODM
- Validator.js for URL validation
