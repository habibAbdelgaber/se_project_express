class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}

module.exports = ForbiddenError;
