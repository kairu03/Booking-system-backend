import { createLimiter } from "./createLimiter.js";


// limits each user per network
export const loginLimiter = createLimiter(
  `booking:login`,
  10,
  60 * 15,
  'Too many login attempts, try again later',
  { useUserId: true, useIp: true}, // track by userId + ip
);


// limits per network
export const registerLimiter = createLimiter(
  'booking:register',
  10,
  60 * 15,
  'Too many register attempts, try again later',
  { useIp: true }, // track by ip
);
