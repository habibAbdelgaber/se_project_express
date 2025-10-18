// utils/errors.js
// Custom error classes and centralized error handling middleware for Express
// (single AppError class below + factory helpers)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Factory helpers to create typed errors (keeps only one class in file)
function BadRequestError(message = 'Bad Request') {
  return new AppError(message, 400);
}

function NotFoundError(message = 'Not Found') {
  return new AppError(message, 404);
}

function ConflictError(message = 'Conflict') {
  return new AppError(message, 409);
}

function UnauthorizedError(message = 'Unauthorized') {
  return new AppError(message, 401);
}

function ForbiddenError(message = 'Forbidden') {
  return new AppError(message, 403);
}

// Convert common Mongoose/Mongo errors into our custom errors
function handleMongooseError(originalErr) {
  // Duplicate key (unique) error
  if (originalErr && originalErr.code === 11000) {
    const keys = Object.keys(originalErr.keyValue || {}).join(', ');
    return ConflictError(`Duplicate value for field(s): ${keys}`);
  }

  // Validation errors
  if (originalErr && originalErr.name === 'ValidationError') {
    // Return a generic message to match sprint requirements
    return BadRequestError('Invalid data');
  }

  // CastError (invalid ObjectId etc.)
  if (originalErr && originalErr.name === 'CastError') {
    return BadRequestError('Invalid ID');
  }

  // Fallback
  return BadRequestError(originalErr && originalErr.message ? originalErr.message : 'Bad Request');
}

// Express error handling middleware
function errorHandler(err, req, res, next) {
  // Normalize Mongoose/Mongo errors without reassigning the parameter
  const normalized = (err && (err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000))
    ? handleMongooseError(err)
    : err;

  // Default to 500 if statusCode not set
  const status = (normalized && normalized.statusCode) || 500;
  const safeMessage = status === 500 ? 'An error has occurred on the server.' : (normalized && normalized.message) || 'Error';
  // Ensure the response is JSON (some environments fall back to HTML error pages)
  res.set('Content-Type', 'application/json');
  return res.status(status).json({ message: safeMessage });
}

// Export all error classes and middleware
module.exports = {
  AppError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  handleMongooseError,
  errorHandler,
};
