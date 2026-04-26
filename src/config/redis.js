import { Redis } from "@upstash/redis";

let redis;

export const getRedis = () => {
  // create redis instance once then reuse it for the next ones
  if (!redis) { 
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    });
  }

  return redis;
};