import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRedis } from "../../config/redis.js";

export const testStore = new Map();

export const createLimiter = (prefix, maxRequests, windowSeconds, message) => {
  return asyncHandler(async (req, res, next) => {

    const isTest = process.env.NODE_ENV === "test";

    const testId = req.headers["x-test-id"];
    const identity = isTest
      ? (testId || "test-global") // use testId in test env
      : (req.user?.id || req.ip) // use userId or ip in dev/prod env

    const key = `${prefix}:${identity}`;

    // storage based on env 
    const store = isTest ? testStore : null; // if test env, use in-memory
    const redis = isTest ? null : getRedis(); // if dev/prod env, use redis 

    let requests;

      // use in-memory store during test env
    if (isTest) {
      const current = store.get(key) || 0;
      requests = current + 1;
      store.set(key, requests);
    } else {
      // use redis in dev/prod env to count redis key for ratelimiting 
      requests = await redis.incr(key);

      if (requests === 1) {
        await redis.expire(key, windowSeconds);
      }
    }

    if (requests > maxRequests) {
      return res.status(429).json({
        success: false,
        message: message || 'Too many requests, try again later'
      });
    }

    next();
  });
};