import express from "express";
import dotenv from 'dotenv';
import helmet from "helmet";
import morgan from "morgan";
import cors from 'cors';
import mongoSanitize from "@exortek/express-mongo-sanitize";
import { logger } from "./config/logger.js";

import authRoutes from './modules/auth/authRoutes.js';
import categoryRoutes from './modules/categories/categoryRoutes.js';
import bookingRoutes from './modules/bookings/bookingRoutes.js';
import resourceRoutes from './modules/resources/resourceRoutes.js';
import { errorHandler } from "./middlewares/errorHandler.js";
import { globalLimiter } from "./middlewares/ratelimit/globalLimiter.js";
import { corsOptions } from "./config/cors.js";

// load environment variables
dotenv.config();

// create server
const app = express();

// prevent exposing that i use express
app.disable('x-powered-by');

// secure HTTP headers
app.use(helmet());

// handle cross origin requests from allowed frontends
app.use(cors(corsOptions));

// json body parser
app.use(express.json());

// sends logs to winston thru logger.info after trim
app.use(
  morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
)

// sanitize requests to prevent MongoDB injection
app.use(mongoSanitize({ replaceWith: '_' }));

// enable trusting proxy headers for proper IP tracking (required for rate limiting)
app.set('trust proxy', 1);

// disable global limiter in test env
if (process.env.NODE_ENV !== 'test') {
  app.use(globalLimiter);
}

// test route
app.get('/', (req, res) => {
  res.send('Booking system api is running');
});
// healht check
app.get('/health', async (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(errorHandler);

export default app;