import { connectDB } from "./config/db.js";
import app from './app.js'
import { logger } from "./config/logger.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server connected to PORT ${PORT}`);
    })
  } catch (error) {
    logger.error('Error connecting to MongoDB');
    process.exit(1);
  }
}

startServer();

