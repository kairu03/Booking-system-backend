import { createLimiter } from "./createLimiter.js";

export const loginLimiter = createLimiter(
  `booking:login`,
  3,
  60 * 15,
  'Too many login attempts, try again later',
);


export const registerLimiter = createLimiter(
  'booking:register',
  5,
  60 * 15,
  'Too many register attempts, try again later',
);
