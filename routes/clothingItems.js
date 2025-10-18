const express = require('express');

const mongoose = require('mongoose');

const router = express.Router();

let upload;
try {
  // try to require multer; if it's not installed we fall back to a no-op
  // middleware so the server doesn't crash. Install multer locally to enable
  // multipart/form-data parsing.
  // eslint-disable-next-line global-require
  const multer = require('multer');
  upload = multer();
} catch (e) {
  // fallback: provide a no-op upload.none() middleware
  // This allows the server to run even when multer isn't installed, but
  // multipart/form-data will not be parsed until multer is installed.
  // eslint-disable-next-line no-console
  console.warn('multer not installed; POST /items will not parse multipart/form-data. Install multer to enable it.');
  upload = { none: () => (req, res, next) => next() };
}

// Validate :itemId parameter early and return JSON 400 for malformed ids
// Tests expect a 400 Bad Request when the provided id is not a valid ObjectId.
router.param('itemId', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid item id' });
  }
  return next();
});

// Import controller functions
const { getClothingItems, createClothingItem, deleteClothingItem } = require('../controllers/clothingItems');

// GET: returns all clothing items
router.get('/', getClothingItems);

// GET: returns single clothing item
router.get('/:itemId', require('../controllers/clothingItems').getClothingItem);

// GET: returns likes array for an item
router.get('/:itemId/likes', require('../controllers/clothingItems').getItemLikes);

// POST: creates a new item (accepts form-data fields)
router.post('/', upload.none(), createClothingItem);

// DELETE: deletes an item by _id
router.delete('/:itemId', deleteClothingItem);

// like an item
router.put('/:itemId/likes', require('../controllers/clothingItems').likeClothingItem);

// unlike an item
router.delete('/:itemId/likes', require('../controllers/clothingItems').unlikeClothingItem);

module.exports = router;