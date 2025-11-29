# WTWR (What to Wear?): Back End

The WTWR back end is a RESTful API server for the *What to Wear?* application.  
It manages users, clothing items, and likes, and provides secure access to data through authenticated routes.  
The server connects to a MongoDB database and exposes endpoints used by the front end to manage clothing items and user profiles.

---

## 🚀 Functionality Overview

The API provides the following features:

### 👤 Users
- Create and manage user profiles
- Store avatar images as URLs
- Enforce validation rules (name length, valid URLs, required fields)

### 👕 Clothing Items
- Create clothing items with:
  - name
  - weather type (`hot`, `warm`, `cold`)
  - image URL
- Delete clothing items
- Retrieve all items or a single item by ID

### ❤️ Likes
- Like an item
- Remove a like from an item
- Get the list of users who liked an item

### 🔐 Authentication (via middleware / stub)
- Protects item creation and likes
- Uses `req.user._id` as the authenticated user source
- Prevents client-side identity spoofing

---

## 🔗 API Endpoints

### Clothing Items
- `GET /items` — Get all clothing items  
- `GET /items/:itemId` — Get one clothing item by ID  
- `POST /items` — Create a new clothing item  
- `DELETE /items/:itemId` — Delete a clothing item  

### Likes
- `GET /items/:itemId/likes` — Get likes for an item  
- `PUT /items/:itemId/likes` — Like an item  
- `DELETE /items/:itemId/likes` — Remove like  

---

## 🛠 Technologies & Tools Used

### Backend
- **Node.js** — JavaScript runtime
- **Express.js** — REST API framework
- **MongoDB** — Database
- **Mongoose** — ODM for MongoDB

### Security & Validation
- **Validator.js** — URL validation
- **mongoose ObjectId validation** — Prevents invalid database queries
- **Authentication middleware** — Injects `req.user` safely

### Development Tools
- **Nodemon** — Hot reload during development
- **ESLint** — Enforces coding standards
- **Prettier** — Code formatting
- **Postman / Insomnia** — API testing
- **Multer** — Form-data handling (optional for uploads)

---

## ▶ Running the Project

### Start server
