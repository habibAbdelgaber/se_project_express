const express = require('express');

const router = express.Router();

const { auth } = require('../middlewares/auth');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');
const { NOT_FOUND_ERROR_CODE } = require('../utils/errors');
const { createUser, login } = require('../controllers/users');

router.post("/signup", createUser);
router.post("/signin", login);

router.use('/users', auth, usersRouter);
router.use('/items', clothingItemsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).json({ message: 'Resource not found' });
});

module.exports = router;
