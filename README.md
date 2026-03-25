# WTWR (What to Wear?) — Back End

## Overview

This is a RESTful API server for the *What to Wear?* application. It manages users, clothing items, and likes using Express.js and MongoDB. The API includes JWT-based authentication, request validation, centralized error handling, and request/error logging.

---

## Project Structure

```
├── app.js                  # Main application entry point
├── controllers/            # Request handlers
│   ├── clothingItems.js
│   └── users.js
├── middlewares/            # Express middleware
│   ├── auth.js             # JWT authentication
│   ├── error-handler.js    # Centralized error handler
│   ├── logger.js           # Winston request & error loggers
│   └── validation.js       # Celebrate/Joi validation
├── models/                 # Mongoose schemas
│   ├── clothingItem.js
│   └── user.js
├── routes/                 # API route definitions
│   ├── index.js
│   ├── clothingItems.js
│   └── users.js
├── utils/                  # Utility functions
│   ├── config.js           # JWT secret configuration
│   └── errors.js           # Custom error classes
└── package.json
```

---

## API Endpoints

### Public Routes (No Authentication Required)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/signup` | Create a new user account |
| POST | `/signin` | Login and receive a JWT token |
| GET | `/items` | Get all clothing items |

### Protected Routes (Require `Authorization: Bearer <token>`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update current user (name, avatar) |
| POST | `/items` | Create a new clothing item |
| DELETE | `/items/:itemId` | Delete an item (owner only) |
| PUT | `/items/:itemId/likes` | Like an item |
| DELETE | `/items/:itemId/likes` | Unlike an item |

---

## Authentication

JWT (JSON Web Token) is used for authentication:

1. Sign up via `POST /signup` with `name`, `avatar`, `email`, and `password`
2. Login via `POST /signin` to receive a token
3. Include the token in the `Authorization` header: `Bearer <token>`
4. Tokens expire after **7 days**

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `JWT_SECRET` | `dev-secret-key` | Secret key for JWT signing |
| `NODE_ENV` | — | Set to `production` in production |



## Technologies

- **Node.js** + **Express.js** — server framework
- **MongoDB** + **Mongoose** — database and ODM
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT authentication
- **celebrate** + **Joi** + **validator** — request validation
- **winston** + **express-winston** — logging
- **cors** — Cross-Origin Resource Sharing

# WTWR API domain
[WTWR API](https://api.wtwr.pymastery.com)

# Frontend repository
[Project Repo](https://wtw.pymastery.com)

# WTWR project pitch video
Find out more about the process on this video [Check out](https://drive.google.com/file/d/1AukDqAj700N4-EF4TZeN9Sw-LPhDkYWa/view?usp=sharing)
