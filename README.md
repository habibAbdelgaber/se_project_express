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

---

## Local Development

### Prerequisites

- Node.js v18+
- MongoDB running locally on port `27017`

### Setup

```bash
# Clone the repository
git clone https://github.com/habibAbdelgaber/se_project_express.git
cd se_project_express

# Install dependencies
npm install

# Start in development mode (auto-restart with nodemon)
npm run dev

# Start in production mode
npm start
```

The server will start on `http://localhost:5000`.

---

## Deployment on DigitalOcean App Platform

DigitalOcean App Platform is a fully managed PaaS that handles infrastructure, scaling, and deployments automatically.

### 1. Set Up a Managed MongoDB Database

The App Platform does not run MongoDB locally, so you need a hosted database first.

1. In the DigitalOcean control panel, go to **Databases** → **Create Database Cluster**
2. Choose **MongoDB**, select a plan and region
3. Once created, go to the cluster's **Connection Details**
4. Copy the **Connection String** (it looks like `mongodb+srv://...`)

### 2. Push Your Code to GitHub

App Platform deploys directly from a Git repository.

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

### 3. Create a New App on App Platform

1. In the DigitalOcean control panel, go to **App Platform** → **Create App**
2. Choose **GitHub** as the source and authorize DigitalOcean to access your repositories
3. Select your repository and the branch to deploy (e.g., `main`)
4. DigitalOcean will detect Node.js automatically

### 4. Configure the App

On the **Configure your app** screen:

- **Run Command**: `npm start`
- **HTTP Port**: `5000` (or match your `PORT` environment variable)
- **Instance Size**: Basic (512 MB RAM is sufficient to start)

### 5. Set Environment Variables

Still on the configuration screen, scroll to **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `JWT_SECRET` | A long, random secret string |
| `NODE_ENV` | `production` |
| `MONGO_URI` | The connection string copied from Step 1 |

> Make sure `MONGO_URI` is marked as **Encrypted** to keep it secure.

### 6. Connect the Database (Optional Shortcut)

If you created a DigitalOcean Managed MongoDB database, you can also attach it directly:

1. On the app configuration screen, go to **Add Resource** → **Database**
2. Select your managed database cluster
3. DigitalOcean will automatically inject the connection string as an environment variable

### 7. Deploy

1. Click **Next** through the remaining screens and review the plan cost
2. Click **Create Resources** to start the first deployment
3. App Platform will build and deploy the app — this takes a few minutes
4. Once complete, your API will be available at the URL shown in the app dashboard (e.g., `https://your-app-name.ondigitalocean.app`)

### 8. Verify the Deployment

```bash
# Test a public endpoint
curl https://your-app-name.ondigitalocean.app/items
```

You should receive a JSON response (empty array if no items exist yet).

### 9. Redeploy After Changes

Every time you push to the connected branch, App Platform automatically triggers a new deployment. You can also trigger one manually from the **Deployments** tab in the app dashboard.

---

## Technologies

- **Node.js** + **Express.js** — server framework
- **MongoDB** + **Mongoose** — database and ODM
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT authentication
- **celebrate** + **Joi** + **validator** — request validation
- **winston** + **express-winston** — logging
- **cors** — Cross-Origin Resource Sharing
