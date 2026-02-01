# WTWR (What to Wear?) - Backend API

## Overview
This is a RESTful API server for the "What to Wear?" application. It manages users, clothing items, and likes using Express.js and MongoDB. The API includes JWT-based authentication and authorization.

## Project Structure
```
├── app.js              # Main application entry point
├── controllers/        # Request handlers
│   ├── clothingItems.js
│   └── users.js
├── middlewares/        # Express middleware
│   └── auth.js         # JWT authentication middleware
├── models/             # Mongoose schemas
│   ├── clothingItem.js
│   └── user.js
├── routes/             # API route definitions
│   ├── clothingItems.js
│   ├── index.js
│   └── users.js
├── utils/              # Utility functions
│   ├── config.js       # JWT secret configuration
│   └── errors.js       # Error classes and handlers
├── package.json        # Dependencies and scripts
└── replit.md           # This file
```

## API Endpoints

### Public Routes (No Authentication Required)
- `GET /` - Health check / API info
- `POST /signup` - Create a new user account
- `POST /signin` - Login and receive JWT token
- `GET /items` - Get all clothing items

### Protected Routes (Require JWT Token)
- `GET /users/me` - Get current user profile
- `PATCH /users/me` - Update current user (name, avatar)
- `GET /items/:itemId` - Get one clothing item
- `POST /items` - Create a new clothing item
- `DELETE /items/:itemId` - Delete a clothing item (owner only)
- `PUT /items/:itemId/likes` - Like an item
- `DELETE /items/:itemId/likes` - Remove like
- `GET /items/:itemId/likes` - Get likes for an item

## Authentication
The API uses JWT (JSON Web Token) for authentication:
1. Sign up with `POST /signup` providing name, avatar, email, and password
2. Login with `POST /signin` to receive a JWT token
3. Include the token in requests as: `Authorization: Bearer <token>`
4. Tokens expire after 7 days

## Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string (required for database operations)
- `JWT_SECRET` - Secret key for JWT signing (has default for development)

## Setup
1. Set the `MONGODB_URI` environment variable to your MongoDB connection string (e.g., MongoDB Atlas)
2. Optionally set `JWT_SECRET` for production
3. Run `npm install` to install dependencies
4. Run `npm run dev` for development or `npm start` for production

## Technologies
- Node.js with Express.js
- MongoDB with Mongoose ODM
- bcryptjs for password hashing
- jsonwebtoken for JWT authentication
- Validator.js for URL/email validation

## Security Features
- Passwords are hashed with bcrypt before storage
- Passwords are never returned in API responses (select: false)
- JWT tokens expire after 7 days
- Users can only delete their own clothing items
- Protected routes require valid JWT tokens
