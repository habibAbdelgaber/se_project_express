const mongoose = require('mongoose');
const { ClothingItem } = require('../models/clothingItem');
const { NotFoundError } = require('../utils/errors');

// GET: return all items
const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

// GET: return single item or 404 if not found
const getClothingItem = async (req, res, next) => {
  try {
    // Validate itemId early: malformed ids should return 400
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }
    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new NotFoundError('Item not found')
    );
    return res.json(item);
  } catch (error) {
    return next(error);
  }
};

// GET: return the likes array for an item
const getItemLikes = async (req, res, next) => {
  try {
    // Validate itemId early: malformed ids -> 400
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }
    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new NotFoundError('Item not found')
    );
    return res.json({ likes: item.likes || [] });
  } catch (error) {
    return next(error);
  }
};

// POST: create a new item
const createClothingItem = async (req, res, next) => {
  // 1) Owner must always come from req.user._id; reject if missing
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Accept common field names from JSON or form-data; provide safe defaults
  const name = (req.body.name || req.body.title || req.body.itemName || '').trim();
  const resolvedWeather = req.body.weather || req.body.climate || req.body.temperature;
  const resolvedImage =
    req.body.imageUrl ||
    req.body.link ||
    req.body.image ||
    req.body.image_link ||
    req.body.url;

  const owner = req.user._id;

  // required field checks: name, weather, imageUrl
  if (!name || !resolvedWeather || !resolvedImage) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newItem = new ClothingItem({
      name,
      weather: resolvedWeather,
      imageUrl: resolvedImage,
      owner,
    });
    await newItem.save();
    return res.status(201).json(newItem);
  } catch (error) {
    return next(error);
  }
};

// PUT: like an item
const likeClothingItem = async (req, res, next) => {
  try {
    // Guard: ensure itemId is a valid ObjectId and expect a 400 Bad Request with a JSON message.
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }

    // 2) Acting user must come only from req.user._id
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
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

// DELETE: unlike an item
const unlikeClothingItem = async (req, res, next) => {
  try {
    // Guard: ensure itemId is a valid ObjectId for malformed id -> 400
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }

    // 3) Acting user must come only from req.user._id; no fallback to body/headers
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
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

// DELETE: delete an item by _id
const deleteClothingItem = async (req, res, next) => {
  try {
    // Validate itemId early: malformed ids should return 400 with a JSON message
    if (!mongoose.isValidObjectId(req.params.itemId)) {
      return res.status(400).json({ message: 'Invalid item id' });
    }
    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new NotFoundError('Item not found')
    );
    await item.deleteOne();
    return res.json(item);
  } catch (error) {
    return next(error);
  }
};

// Export all controller functions
module.exports = {
  getClothingItems,
  getClothingItem,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
  getItemLikes,
};
