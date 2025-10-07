const { ClothingItem } = require('../models/clothingItem');
const { NotFoundError } = require('../utils/errors');


// GET: items - return all items
const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.json(items);
  } catch (error) {
    next(error);
  }
};

// GET: items/:itemId — return single item or 404 if not found
const getClothingItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(new NotFoundError('Item not found'));
    return res.json(item);
  } catch (error) {
    next(error);
  }
};

// GET: items/:itemId/likes - return the likes array for an item
const getItemLikes = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(new NotFoundError('Item not found'));
    return res.json({ likes: item.likes || [] });
  } catch (error) {
    next(error);
  }
};

// POST: items - create a new item
const createClothingItem = async (req, res, next) => {
  // owner can come from the authenticated user (req.user._id)
  const { name, weather, imageUrl } = req.body;
  const owner = req.body.owner || (req.user && req.user._id);
  if (!name || !weather || !imageUrl || !owner) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const newItem = new ClothingItem({ name, weather, imageUrl, owner });
    await newItem.save();
    return res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};
// PUT: items/:itemId/likes — like an item
const { BadRequestError } = require('../utils/errors');
const likeClothingItem = async (req, res, next) => {
  try {
    const userId = (req.user && req.user._id) || req.body.userId;
    if (!userId) {
      throw new BadRequestError('Authenticated user id (req.user._id) or body.userId is required to like an item');
    }
    const updated = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(new NotFoundError('Item not found'));
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE: items/:itemId/likes — unlike an item
const unlikeClothingItem = async (req, res, next) => {
  try {
    const userId = (req.user && req.user._id) || req.body.userId;
    if (!userId) {
      throw new BadRequestError('Authenticated user id (req.user._id) or body.userId is required to unlike an item');
    }
    const updated = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(new NotFoundError('Item not found'));
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

// DELETE: items/:itemId — delete an item by _id
const deleteClothingItem = async (req, res, next) => {
  try {
    // findByIdAndDelete doesn't support orFail(), so find then delete
    const item = await ClothingItem.findById(req.params.itemId).orFail(new NotFoundError('Item not found'));
    await item.deleteOne();
    return res.json(item);
  } catch (error) {
    next(error);
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