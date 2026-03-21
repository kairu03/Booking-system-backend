import { redis } from "./redis.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


// limits each user per network
export const loginLimiter = asyncHandler(async (req, res, next) => {
  const ip = req.ip; // IP of the client (network)
  const userId = req.user.id; // user Id from auth middleware
  const key = `booking:login:${userId}:${ip}`; // unique key per user + IP

  //  contains the current number of login attempts for this IP
  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, 60 * 15); // 15mins
  }

  if (requests > 10) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts, try again later'
    });
  }

  next();
});


// limits per network
export const registerLimiter = asyncHandler(async (req, res, next) => {
  const ip = req.ip; 
  const key = `booking:register:${ip}`;

  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, 60 * 15);
  }

  if (requests > 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many register attempts, try again later'
    });
  }

  next();
});
