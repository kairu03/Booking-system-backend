import { asyncHandler } from "../../utils/asyncHandler.js";
import { getRedis } from "../../config/redis.js";

export const testStore = new Map();

export const createLimiter = (prefix, maxRequests, windowSeconds, message) => {
  return asyncHandler(async (req, res, next) => {

    const isTest = process.env.NODE_ENV === "test";

    const testId = req.headers["x-test-id"];
    const identity = isTest
      ? (testId || "test-global")
      : (req.user?.id || req.ip)

    const key = `${prefix}:${identity}`;

    const store = isTest ? testStore : null;
    const redis = isTest ? null : getRedis();

    let requests;

    if (isTest) {
      const current = store.get(key) || 0;
      requests = current + 1;
      store.set(key, requests);
    } else {
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