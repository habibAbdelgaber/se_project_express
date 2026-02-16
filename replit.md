# WTWR (What to Wear?) - Backend API

## Overview

This is a RESTful API backend for the "What to Wear?" application built with Express.js and MongoDB (via Mongoose). The app helps users decide what to wear based on weather conditions. Users can create accounts, manage clothing items categorized by weather type (hot, warm, cold), and like/unlike items. The API uses JWT-based authentication to protect routes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Framework
- **Express.js** serves as the web framework. The entry point is `app.js`, which sets up middleware (JSON parsing, CORS, URL encoding), connects to MongoDB, defines public routes (`/signup`, `/signin`), and mounts protected route groups (`/users`, `/items`).

### Project Structure (MVC Pattern)
The codebase follows a Model-View-Controller pattern:
- **Models** (`models/`): Mongoose schemas for `User` and `ClothingItem`. User model includes a static method `findUserByCredentials` for login validation. Password field is excluded from queries by default (`select: false`).
- **Controllers** (`controllers/`): Business logic for handling requests. `users.js` handles signup, login, and profile management. `clothingItems.js` handles CRUD operations and likes.
- **Routes** (`routes/`): Express routers defining endpoints. Items routes are partially public (GET all items doesn't require auth) while create/update/delete require authentication.
- **Middlewares** (`middlewares/`): JWT authentication middleware that extracts Bearer tokens from the Authorization header.
- **Utils** (`utils/`): Shared utilities including error classes and JWT configuration.

### Authentication & Authorization
- **JWT tokens** are issued on login (`POST /signin`) and signup is handled by `POST /signup`.
- The `auth` middleware verifies tokens using a secret from `utils/config.js` (defaults to `'dev-secret-key-change-in-production'`, configurable via `JWT_SECRET` env var).
- Passwords are hashed with **bcryptjs** (10 salt rounds).
- Item deletion is restricted to the item's owner (ForbiddenError for non-owners).

### Error Handling
- A single `AppError` class extends `Error` with a `statusCode` property.
- Factory functions (`BadRequestError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`, `ForbiddenError`) create typed errors.
- A `handleMongooseError` utility converts Mongoose-specific errors (duplicate key 11000, ValidationError, CastError) into appropriate AppError instances.
- A centralized `errorHandler` middleware catches all errors and sends consistent JSON responses.

### Database
- **MongoDB** via **Mongoose** ODM. The connection string is hardcoded to `mongodb://127.0.0.1:27017/wtwr_db`.
- Two collections: `user` and `clothingItem`.
- `ClothingItem` has an `owner` field (ObjectId ref to user) and a `likes` array (ObjectId refs to users).
- `User` has `name`, `avatar` (URL validated), `email` (unique, validated), and `password` (hashed, hidden from queries).

### Route Structure
- **Public**: `POST /signup`, `POST /signin`, `GET /items`
- **Protected** (require JWT): `GET /users/me`, `PATCH /users/me`, `POST /items`, `GET /items/:itemId`, `PATCH /items/:itemId`, `DELETE /items/:itemId`, `PUT /items/:itemId/likes`, `DELETE /items/:itemId/likes`, `GET /items/:itemId/likes`
- Route parameter validation: `itemId` is validated as a valid MongoDB ObjectId via `router.param()` middleware.
- Some routes have aliases (e.g., `POST /items/create`, `DELETE /items/delete/:itemId`).

### File Upload Support
- **Multer** is included for potential multipart/form-data parsing on item creation routes, though currently configured with `upload.none()` (no file fields). It gracefully falls back if multer is unavailable.

### Running the Application
- `npm start` — runs `node app.js` (production)
- `npm run dev` — runs `nodemon app.js` (development with auto-restart)
- `npm run lint` — ESLint with Airbnb base config + Prettier
- Default port: **3000** (configurable via `PORT` env var)

## External Dependencies

### Runtime Dependencies
- **express** (^4.21.1) — Web framework
- **mongoose** (^8.18.2) — MongoDB ODM
- **bcryptjs** (^3.0.3) — Password hashing
- **jsonwebtoken** (^9.0.3) — JWT creation and verification
- **cors** (^2.8.6) — Cross-origin resource sharing
- **validator** (^13.15.15) — String validation (URLs, emails)
- **multer** (^2.0.2) — Multipart form data parsing

### Dev Dependencies
- **nodemon** — Auto-restart during development
- **eslint** + **eslint-config-airbnb-base** + **eslint-config-prettier** — Linting
- **prettier** — Code formatting

### External Services
- **MongoDB** — Required database. Must be running locally at `mongodb://127.0.0.1:27017/wtwr_db`. No cloud database is currently configured. When deploying on Replit, a MongoDB instance needs to be provisioned or the connection string needs to be updated to point to a hosted MongoDB service (e.g., MongoDB Atlas).