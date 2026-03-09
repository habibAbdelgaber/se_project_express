const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { JWT_SECRET } = require('../utils/config');
const {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} = require('../utils/errors');

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
    return next(new BadRequestError('All fields are required: name, avatar, email, password'));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, avatar, email, password: hashedPassword });
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictError('A user with this email already exists'));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Invalid data'));
    }
    if (error.name === 'CastError') {
      return next(new BadRequestError('The id string is in an invalid format'));
    }
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email and password are required'));
  }

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (error) {
    if (error.message === 'Incorrect email or password') {
      return next(new UnauthorizedError('Incorrect email or password'));
    }
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

    return res.json(user);
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

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateCurrentUser,
};
