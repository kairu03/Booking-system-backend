import { getRedis } from "../config/redis.js";

const redis = getRedis();

export const clearRatelimitKeys = async () => {
  const keys = await redis.keys('*'); // get all keys

  if (keys > 0) {
    await redis.del(...keys); // delete all keys 
  }
}