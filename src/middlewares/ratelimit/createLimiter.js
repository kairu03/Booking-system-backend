import { request } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { redis } from "../../config/redis.js";

export const createLimiter = (prefix, maxRequests, windowSeconds, message, options = {}) => {
  return asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const ip = req.ip;

    // build Redis key based on options 
    const key =
      options.useUserId && options.useIp ? `${prefix}:${userId}:${ip}`
        : options.userId ? `${prefix}:${userId}`
          : options.useIp ? `${prefix}:${ip}`
            : prefix;

    // requests count in redis
    const requests = await redis.incr(key);

    if (request === 1) {
      await redis.expire(key, windowSeconds);
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