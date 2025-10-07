const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser } = require('../controllers/users');

// GET: users — returns all users
router.get('/', getUsers);

// GET: users/:userId — returns a user by _id
router.get('/:userId', getUser);

// POST: users — creates a new user
router.post('/', createUser);

// Export the router
module.exports = router;
