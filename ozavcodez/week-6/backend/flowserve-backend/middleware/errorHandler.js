const logger = require('../utils/logger');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error(err.stack);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => e.message);
    return res.status(400).json({ error: 'Validation error', details: errors });
  }

  // Sequelize database error
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({ error: 'Database error' });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;