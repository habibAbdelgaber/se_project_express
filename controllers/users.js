const { User } = require('../models/user');
const { NotFoundError, BadRequestError, HTTP_OK, HTTP_CREATED } = require('../utils/errors');

// GET: return all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

// GET: return a user by _id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).orFail(new NotFoundError('User not found'));
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

// POST: create a new user
const createUser = async (req, res, next) => {
  const { name, avatar } = req.body;
  try {
    const newUser = new User({ name, avatar });
    await newUser.save();
    return res.status(HTTP_CREATED).json(newUser);
  } catch (error) {
    // Convert Mongoose validation/cast errors to 400
    if (error && (error.name === 'ValidationError' || error.name === 'CastError')) {
      return next(BadRequestError('Invalid data'));
    }
    // If duplicate key (user already exists), return existing user with 200
    if (error && error.code === 11000) {
      try {
        const existing = await User.findOne({ name });
        if (existing) return res.status(HTTP_OK).json(existing);
      } catch (findErr) {
        return next(findErr);
      }
    }
    return next(error);
  }
};

// Export all controller functions
module.exports = {
  getUsers,
  getUser,
  createUser,
};
