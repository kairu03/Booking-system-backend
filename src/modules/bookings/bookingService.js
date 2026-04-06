import { ApiError } from "../../utils/apiError.js";
import Resource from "../resources/resourceModel.js";
import Booking from "./bookingModel.js";


// GET 
export const getAllBookings = async () => {
  const bookings = await Booking.find({
    status: { $in: ['pending', 'approved', 'cancelled'] }
  }).sort({ createdAt: -1 });

  return bookings;
}


// GET
export const getMyBookings = async (userId) => {
  const myBookings = await Booking.find({ user: userId });

  if (!myBookings) {
    throw new ApiError('No bookings found', 404);
  }

  return myBookings;
}


// POST
export const createBooking = async ({ userId, resourceId, startDate, endDate }) => {
  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError('Resource not found', 404);
  }

  if (!resource.isActive) {
    throw new ApiError('Resource is inactive', 403);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const overlappedBooking = await Booking.findOne({
    resource: resourceId,
    status: { $in: [ 'approved', 'pending' ]},
    startDate: { $lt: end },
    endDate: { $gt: start }
  });

  if (overlappedBooking) {
    throw new ApiError('This resource is already booked', 400);
  }

  const newBooking = await Booking.create({
    user: userId,
    resource: resourceId,
    startDate,
    endDate
  });

  return newBooking;
}


// PATCH
export const updateBookingStatus = async ({ bookingId, updatedStatus }) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  const updatedBookingStatus = await Booking.findByIdAndUpdate(
    bookingId,
    updatedStatus,
    { new: true, runValidators: true }
  );

  return updatedBookingStatus;
}


// DELETE
export const cancelBooking = async (bookingId, userId, role) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError('Booking not found', 404);
  }

  if (!booking.user.equals(userId) && role !== 'admin') {
    throw new ApiError('Not authorized', 403);
  }

  if (booking.status !== 'approved' && booking.status !== 'pending') {
    throw new ApiError('Booking cannot be cancelled');
  }

  booking.status = 'cancelled';

  await booking.save();

  return booking;
}
