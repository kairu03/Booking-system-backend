import { logger } from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || res.statusCode || 500;

  // log error to winston 
  logger.error(`${err.name}: ${err.message}\n${err.stack}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error',

    stack: process.env.NODE_ENV === 'development' ? err.stack : null
  });
};