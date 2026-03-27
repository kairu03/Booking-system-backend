import winston from 'winston';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = createLogger({
  level: 'info',

  format: isDev
  ? winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
  : winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ]
});