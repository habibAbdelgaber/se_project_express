const express = require('express');

const router = express.Router();

const { auth } = require('../middlewares/auth');
const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');
const { NotFoundError } = require('../utils/errors');

router.use('/users', auth, usersRouter);
router.use('/items', clothingItemsRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Resource not found'));
});

module.exports = router;
