const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

let upload;
try {
  // Try to use multer for parsing form-data
  const multer = require('multer');
  upload = multer();
} catch (e) {
  // Fallback: no-op middleware if multer is not installed
  console.info('multer not installed; POST /items will not parse multipart/form-data. Install multer to enable it.');
  upload = { none: () => (req, res, next) => next() };
}

// Validate :itemId and return 400 for invalid ObjectId
router.param('itemId', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid item id' });
  }
  return next();
});

// Import controller functions
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  getClothingItem,
  getItemLikes,
  likeClothingItem,
  unlikeClothingItem,
} = require('../controllers/clothingItems');

// GET: all clothing items
router.get('/', getClothingItems);

// GET: single clothing item
router.get('/:itemId', getClothingItem);

// GET: likes for an item
router.get('/:itemId/likes', getItemLikes);

// POST: create a new item
router.post('/', upload.none(), createClothingItem);

// DELETE: delete an item
router.delete('/:itemId', deleteClothingItem);

// PUT: like an item
router.put('/:itemId/likes', likeClothingItem);

// DELETE: unlike an item
router.delete('/:itemId/likes', unlikeClothingItem);

module.exports = router;
