const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();
const { BAD_REQUEST_ERROR_CODE } = require('../utils/errors');
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

let upload;

try {
  // Handling multipart/form-data
  upload = multer();
} catch (e) {
  // Fallback: no-op middleware if multer is not installed
  console.info('multer not installed; POST /items will not parse multipart/form-data. Install multer to enable it.');
  upload = { none: () => (req, res, next) => next() };
}

// Validate :itemId and return 400 for invalid ObjectId
router.param('itemId', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid item id' });
  }
  return next();
});


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
