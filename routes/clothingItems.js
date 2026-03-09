const express = require('express');
const multer = require('multer');

const router = express.Router();
const { auth } = require('../middlewares/auth');
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

router.post('/', auth, upload.none(), createClothingItem);

router.delete('/:itemId', auth, deleteClothingItem);

router.put('/:itemId/likes', auth, likeClothingItem);

router.delete('/:itemId/likes', auth, unlikeClothingItem);

module.exports = router;
