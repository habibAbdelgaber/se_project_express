const express = require('express');
const multer = require('multer');

const router = express.Router();
const { auth } = require('../middlewares/auth');
const { validateCardBody, validateId } = require('../middlewares/validation');
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
} = require('../controllers/clothingItems');

let upload;

try {
  upload = multer();
} catch (e) {
  console.info('multer not installed; POST /items will not parse multipart/form-data.');
  upload = { none: () => (req, res, next) => next() };
}

router.get('/', getClothingItems);

router.post('/', auth, upload.none(), validateCardBody, createClothingItem);

router.delete('/:itemId', auth, validateId, deleteClothingItem);

router.put('/:itemId/likes', auth, validateId, likeClothingItem);

router.delete('/:itemId/likes', auth, validateId, unlikeClothingItem);

module.exports = router;
