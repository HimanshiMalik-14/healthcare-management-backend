const { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  // Log real error for debugging
  console.error('[Error]', err);

  if (err instanceof UniqueConstraintError) {
    const field = err.errors && err.errors[0] ? err.errors[0].path : 'Resource';
    return res.status(409).json({
      success: false,
      message: `${field} already exists or is already assigned`,
      errors: err.errors ? err.errors.map(e => ({ field: e.path, message: e.message })) : undefined,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.errors && err.errors[0] ? err.errors[0].message : 'Validation error',
      errors: err.errors ? err.errors.map(e => ({ field: e.path, message: e.message })) : undefined,
    });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      success: false,
      message: 'Referenced entity does not exist',
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors ? { errors: err.errors } : {}),
  });
};

module.exports = errorHandler;
