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

## Deployment on DigitalOcean

### 1. Create a Droplet

1. Log in to [DigitalOcean](https://cloud.digitalocean.com)
2. Create a new Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic (1 GB RAM / 1 CPU minimum)
   - **Region**: Choose closest to your users
   - **Authentication**: SSH Key (recommended)
3. Note the Droplet's public IP address

### 2. Connect to the Droplet

```bash
ssh root@your_droplet_ip
```

### 3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # verify installation
```

### 4. Install and Start MongoDB

```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Enable and start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### 5. Clone the Repository

```bash
cd /home
git clone https://github.com/habibAbdelgaber/se_project_express.git
cd se_project_express
npm install
```

### 6. Set Environment Variables

Create a `.env` file in the project root:

```bash
nano .env
```

Add the following:

```
PORT=3000
JWT_SECRET=your_strong_secret_key_here
NODE_ENV=production
```

Save and close (`Ctrl+X`, then `Y`, then `Enter`).

### 7. Install PM2 (Process Manager)

PM2 keeps the server running and restarts it automatically on crash or reboot:

```bash
sudo npm install -g pm2

# Start the application with PM2
pm2 start app.js --name wtwr-api

# Save the PM2 process list so it restarts on reboot
pm2 save
pm2 startup
```

Run the command that `pm2 startup` outputs to enable auto-start on boot.

### 8. Install and Configure Nginx (Reverse Proxy)

```bash
sudo apt-get install -y nginx
```

Create an Nginx server block:

```bash
sudo nano /etc/nginx/sites-available/wtwr
```

Paste the following (replace `your_domain_or_ip` with your actual domain or IP):

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/wtwr /etc/nginx/sites-enabled/
sudo nginx -t          # test config
sudo systemctl restart nginx
```

### 9. Configure the Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 10. Set Up SSL with Let's Encrypt (HTTPS)

```bash
sudo apt-get install -y certbot python3-certbot-nginx

# Replace your_domain.com with your actual domain name
sudo certbot --nginx -d your_domain.com

# Certbot will auto-renew — verify the timer is active
sudo systemctl status certbot.timer
```

### 11. Verify Deployment

```bash
# Check the app is running
pm2 status

# Check logs
pm2 logs wtwr-api

# Test the API
curl https://your_domain.com/items
```

---

## Useful PM2 Commands

```bash
pm2 status          # View running processes
pm2 logs wtwr-api   # View application logs
pm2 restart wtwr-api  # Restart the application
pm2 stop wtwr-api   # Stop the application
pm2 delete wtwr-api # Remove from PM2
```

---

## Technologies

- **Node.js** + **Express.js** — server framework
- **MongoDB** + **Mongoose** — database and ODM
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT authentication
- **celebrate** + **Joi** + **validator** — request validation
- **winston** + **express-winston** — logging
- **cors** — Cross-Origin Resource Sharing
- **PM2** — production process manager
- **Nginx** — reverse proxy and SSL termination
