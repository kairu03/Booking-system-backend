import express from "express";
import { protectRoute } from '../../middlewares/authMiddleware.js'
import { cancelBooking, createBooking, getAllBookings, getMyBookings, updateBookingStatus } from "./bookingController.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";

const router = express.Router();

router.use(protectRoute);

router.get('/', authorizeRoles('admin') , getAllBookings);

router.get('/:bookingId', getMyBookings);

router.post('/', createBooking);

router.patch('/:bookingId', authorizeRoles('admin') , updateBookingStatus);

router.delete('/:bookingId', cancelBooking);

export default router;

