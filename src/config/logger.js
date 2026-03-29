import winston, { createLogger, format, transports } from 'winston';

const { combine, timestamp, errors, colorize, printf, json } = format;

const isDev = process.env.NODE_ENV !== 'production';

const consoleFormat = printf(({ timestamp, level, message, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = createLogger({
  level: 'info',

  format: combine(
    timestamp(),
    errors({ stack: true }),
  ),

  transports: [
    new transports.Console({
      format: isDev 
        ? combine(colorize(), consoleFormat)
        : combine(json()) 
    }),

     // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: combine(json()) 
    }),

    // File transport for errors only
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(json())
    })
  ],

  exitOnError: false
});