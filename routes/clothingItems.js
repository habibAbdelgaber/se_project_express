const express = require('express');

const router = express.Router();

// Import controller functions
const { getClothingItems, createClothingItem, deleteClothingItem } = require('../controllers/clothingItems');

// GET: items — returns all clothing items
router.get('/', getClothingItems);

// GET: items/:itemId — returns single clothing item
router.get('/:itemId', require('../controllers/clothingItems').getClothingItem);

// GET: items/:itemId/likes — returns likes array for an item
router.get('/:itemId/likes', require('../controllers/clothingItems').getItemLikes);

// POST: items — creates a new item
router.post('/', createClothingItem);

// DELETE: items/:itemId — deletes an item by _id
router.delete('/:itemId', deleteClothingItem);

// like an item
router.put('/:itemId/likes', require('../controllers/clothingItems').likeClothingItem);

// unlike an item
router.delete('/:itemId/likes', require('../controllers/clothingItems').unlikeClothingItem);

module.exports = router;