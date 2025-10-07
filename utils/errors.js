// utils/errors.js
// Custom error classes and centralized error handling middleware for Express
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
class BadRequestError extends CustomError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

// 404 Not Found error
class NotFoundError extends CustomError {
  constructor(message = 'Not Found') {
    super(message, 404);
  }
}

// 409 Conflict error
class ConflictError extends CustomError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}

// 401 Unauthorized error
class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

// 403 Forbidden error
class ForbiddenError extends CustomError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

// Convert common Mongoose/Mongo errors into our custom errors
function handleMongooseError(err) {
  // Duplicate key (unique) error
  if (err && err.code === 11000) {
    const keys = Object.keys(err.keyValue || {}).join(', ');
    return new ConflictError(`Duplicate value for field(s): ${keys}`);
  }

  // Validation errors
  if (err && err.name === 'ValidationError') {
    // Return a generic message to match sprint requirements
    return new BadRequestError('Invalid data');
  }

  // CastError (invalid ObjectId etc.)
  if (err && err.name === 'CastError') {
    return new BadRequestError('Invalid ID');
  }

  // Fallback
  return new BadRequestError(err.message || 'Bad Request');
}

// Express error handling middleware
function errorHandler(err, req, res, next) {
  // Normalize Mongoose/Mongo errors
  if (err && (err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000)) {
    err = handleMongooseError(err);
  }

  // Default to 500 if statusCode not set
  const status = (err && err.statusCode) || 500;
  const safeMessage = status === 500 ? 'An error has occurred on the server.' : (err && err.message) || 'Error';
  res.status(status).json({ message: safeMessage });
}

// Export all error classes and middleware
module.exports = {
  CustomError,
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  handleMongooseError,
  errorHandler,
};
