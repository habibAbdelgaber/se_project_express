const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  HTTP_OK,
  HTTP_CREATED
} = require('../utils/errors');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).orFail(new NotFoundError('User not found'));
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(new NotFoundError('User not found'));
    return res.json(user);
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return next(BadRequestError('All fields are required: name, avatar, email, password'));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, avatar, email, password: hashedPassword });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(HTTP_CREATED).json(userResponse);
  } catch (error) {
    if (error && error.code === 11000) {
      return next(ConflictError('A user with this email already exists'));
    }
    if (error && error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join(', ');
      return next(BadRequestError(messages || 'Invalid data'));
    }
    if (error && error.name === 'CastError') {
      return next(BadRequestError('Invalid data format'));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(BadRequestError('Email and password are required'));
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(HTTP_OK).json({ token });
  } catch (error) {
    return next(error);
  }
};

const updateCurrentUser = async (req, res, next) => {
  const { name, avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).orFail(new NotFoundError('User not found'));

    return res.status(HTTP_OK).json(user);
  } catch (error) {
    if (error && (error.name === 'ValidationError' || error.name === 'CastError')) {
      return next(BadRequestError('Invalid data'));
    }
    return next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  login,
  updateCurrentUser,
};
