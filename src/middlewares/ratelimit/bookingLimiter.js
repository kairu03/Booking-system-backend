import { createLimiter } from "./createLimiter.js";

export const createBookingLimiter = createLimiter(
  `booking:create`,
  5,
  60 * 15,
  'Too many booking attempts, try again later',
);

export const updateBookingLimiter = createLimiter(
  'booking:update',
  5,
  60 * 15,
  'Too many booking updates, try again later',
);

export const cancelBookingLimiter = createLimiter(
  `booking:cancel`,
  5,
  60 * 15,
  'Too many cancellations, try again later',
);