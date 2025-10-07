const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const clothingItemsRouter = require('./clothingItems');

// Mount user and clothing item routers
router.use('/users', usersRouter);
router.use('/items', clothingItemsRouter);

// 404 for any unmatched route within this router
router.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});
// Export the router
module.exports = router;