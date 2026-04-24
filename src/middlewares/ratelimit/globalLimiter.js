import { createLimiter } from "./createLimiter.js";

export const globalLimiter = createLimiter(
  'global',
  100,
  60,
  'Too many requests, please slow down',
);