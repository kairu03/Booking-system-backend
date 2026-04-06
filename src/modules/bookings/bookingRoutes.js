import express from "express";
import { protectRoute } from '../../middlewares/auth.js'
import { cancelBooking, createBooking, getAllBookings, getMyBookings, updateBookingStatus } from "./bookingController.js";
import { authorizeRoles } from "../../middlewares/role.js";
import { validate } from "../../middlewares/validate.js";
import { bookingParamsSchema, createBookingSchema, updateBookingSchema } from "./bookingValidation.js";
import { cancelBookingLimiter, createBookingLimiter, updateBookingLimiter } from "../../middlewares/ratelimit/bookingLimiter.js";

const router = express.Router();

// add protecRoute to all routes
router.use(protectRoute);

router.get('/admin', authorizeRoles('admin') , getAllBookings);

router.get('/', getMyBookings);

router.post('/', 
  createBookingLimiter,
  validate(createBookingSchema),
  createBooking
);

router.patch('/:bookingId', 
  authorizeRoles('admin'), 
  updateBookingLimiter,
  validate(bookingParamsSchema, 'params'),
  validate(updateBookingSchema),
  updateBookingStatus
);

router.delete('/:bookingId', 
  cancelBookingLimiter,
  validate(bookingParamsSchema),
  cancelBooking
);

export default router;

