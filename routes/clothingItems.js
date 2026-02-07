const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();
const { BAD_REQUEST_ERROR_CODE } = require('../utils/errors');
const { auth } = require('../middlewares/auth');
const {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
  getClothingItem,
  getItemLikes,
  likeClothingItem,
  unlikeClothingItem,
} = require('../controllers/clothingItems');

let upload;

try {
  upload = multer();
} catch (e) {
  console.info('multer not installed; POST /items will not parse multipart/form-data. Install multer to enable it.');
  upload = { none: () => (req, res, next) => next() };
}

router.param('itemId', (req, res, next, id) => {
  if (!mongoose.isValidObjectId(id)) {
    return res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid item id' });
  }
  return next();
});

router.get('/', getClothingItems);

router.post('/', auth, upload.none(), createClothingItem);
router.post('/create', auth, upload.none(), createClothingItem);

router.get('/:itemId', auth, getClothingItem);

router.patch('/:itemId', auth, updateClothingItem);
router.patch('/update/:itemId', auth, updateClothingItem);

router.delete('/:itemId', auth, deleteClothingItem);
router.delete('/delete/:itemId', auth, deleteClothingItem);

router.get('/:itemId/likes', auth, getItemLikes);
router.put('/:itemId/likes', auth, likeClothingItem);
router.delete('/:itemId/likes', auth, unlikeClothingItem);

module.exports = router;
