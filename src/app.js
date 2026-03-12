import express from "express";
import dotenv from 'dotenv';
import helmet from "helmet";

import authRoutes from './modules/auth/authRoutes.js';
import categoryRoutes from './modules/categories/categoryRoutes.js';
import { errorHandler } from "./middlewares/errorHandler.js";

// load environment variables
dotenv.config();

// create server
const app = express();

// secure HTTP headers
app.use(helmet());

// json body parser
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Booking system api is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes)

app.use(errorHandler);

export default app;