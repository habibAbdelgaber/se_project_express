const { ClothingItem } = require('../models/clothingItem');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} = require('../utils/errors');

const getClothingItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.json(items);
  } catch (error) {
    return next(error);
  }
};

const createClothingItem = async (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  try {
    const newItem = new ClothingItem({
      name,
      weather,
      imageUrl,
      owner,
    });
    await newItem.save();
    return res.status(201).json(newItem);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data'));
    }
    if (error.name === 'CastError') {
      return next(new BadRequestError('The id string is in an invalid format'));
    }
    return next(error);
  }
};

const likeClothingItem = async (req, res, next) => {
  try {
    const updated = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(new NotFoundError('Item not found'));

    return res.json(updated);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('The id string is in an invalid format'));
    }
    return next(error);
  }
};

const unlikeClothingItem = async (req, res, next) => {
  try {
    const updated = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(new NotFoundError('Item not found'));

    return res.json(updated);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('The id string is in an invalid format'));
    }
    return next(error);
  }
};

const deleteClothingItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(
      new NotFoundError('Item not found')
    );

    if (item.owner.toString() !== req.user._id.toString()) {
      return next(new ForbiddenError('You are not authorized to delete this item'));
    }

    await item.deleteOne();
    return res.json(item);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new BadRequestError('The id string is in an invalid format'));
    }
    return next(error);
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
  unlikeClothingItem,
};
