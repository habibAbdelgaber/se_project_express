const mongoose = require('mongoose');
const { ClothingItem } = require('../models/clothingItem');
const { NotFoundError, ForbiddenError, BadRequestError, BAD_REQUEST_ERROR_CODE, UNAUTHORIZED_ERROR_CODE } = require('../utils/errors');

const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const getClothingItem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid item id' });
    }
    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new NotFoundError('Item not found')
    );
    return res.json(item);
  } catch (error) {
    return next(error);
  }
};

const getItemLikes = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid item id' });
    }
    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new NotFoundError('Item not found')
    );
    return res.json({ likes: item.likes || [] });
  } catch (error) {
    return next(error);
  }
};

const createClothingItem = async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res.status(UNAUTHORIZED_ERROR_CODE).json({ message: 'Authentication required' });
  }

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  const missing = [];
  if (!name) missing.push('name');
  if (!weather) missing.push('weather (hot, warm, or cold)');
  if (!imageUrl) missing.push('imageUrl');

  if (missing.length > 0) {
    return res.status(BAD_REQUEST_ERROR_CODE).json({
      message: `Missing required field(s): ${missing.join(', ')}`,
    });
  }

  try {
    const newItem = new ClothingItem({
      name: name.trim(),
      weather,
      imageUrl,
      owner,
    });
    await newItem.save();
    return res.status(201).json(newItem);
  } catch (error) {
    return next(error);
  }
};

const updateClothingItem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid item id' });
    }

    if (!req.user || !req.user._id) {
      return res.status(UNAUTHORIZED_ERROR_CODE).json({ message: 'Authentication required' });
    }

    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new NotFoundError('Item not found')
    );

    if (item.owner.toString() !== req.user._id.toString()) {
      return next(ForbiddenError('You are not authorized to update this item'));
    }

    const { name, weather, imageUrl } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (weather !== undefined) updates.weather = weather;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    updates.updatedAt = Date.now();

    const updated = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      updates,
      { new: true, runValidators: true }
    ).orFail(new NotFoundError('Item not found'));

    return res.json(updated);
  } catch (error) {
    if (error && (error.name === 'ValidationError' || error.name === 'CastError')) {
      return next(BadRequestError('Invalid data'));
    }
    return next(error);
  }
};

const likeClothingItem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid item id' });
    }

    if (!req.user || !req.user._id) {
      return res.status(UNAUTHORIZED_ERROR_CODE).json({ message: 'Authentication required' });
    }

    const userId = req.user._id;

    const updated = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(new NotFoundError('Item not found'));

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const unlikeClothingItem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid item id' });
    }

    if (!req.user || !req.user._id) {
      return res.status(UNAUTHORIZED_ERROR_CODE).json({ message: 'Authentication required' });
    }

    const userId = req.user._id;

    const updated = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(new NotFoundError('Item not found'));

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const deleteClothingItem = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(BAD_REQUEST_ERROR_CODE).json({ message: 'Invalid item id' });
    }

    if (!req.user || !req.user._id) {
      return res.status(UNAUTHORIZED_ERROR_CODE).json({ message: 'Authentication required' });
    }

    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new NotFoundError('Item not found')
    );

    if (item.owner.toString() !== req.user._id.toString()) {
      return next(ForbiddenError('You are not authorized to delete this item'));
    }

    await item.deleteOne();
    return res.json(item);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
  getItemLikes,
};
