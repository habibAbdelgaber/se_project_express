const { User } = require('../models/clothingItem');
const { NotFoundError } = require('../utils/errors');

//GET: users — return all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    // If duplicate key (user already exists), return existing user with 200
    if (error && error.code === 11000) {
      try {
        const existing = await User.findOne({ name });
        if (existing) return res.status(200).json(existing);
      } catch (findErr) {
        return next(findErr);
      }
    }
    next(error);
  }
};

//GET: user by :userId — return a user by _id
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).orFail(new NotFoundError('User not found'));
    res.json(user);
  } catch (error) {
    next(error);
  }
};

//POST: users - create a new user
const createUser = async (req, res, next) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    return res.status(400).json({ message: 'Name and avatar are required' });
  }
  try {
    const newUser = new User({ name, avatar });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Export all controller functions
module.exports = {
  getUsers,
  getUser,
  createUser,
};
