const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.error(res, messages.join(', '), 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return ApiResponse.error(res, `${field} already exists`, 400);
  }

  if (err.name === 'CastError') {
    return ApiResponse.error(res, 'Invalid ID format', 400);
  }

  const statusCode = err.statusCode || 500;
  return ApiResponse.error(res, err.message || 'Internal Server Error', statusCode);
};

module.exports = errorHandler;