import { asyncHandler } from '../../utils/asyncHandler.js';
import * as bookingService from '.././bookings/bookingService.js';



// GET 
export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getAllBookings();

  return res.status(200).json({
    success: true,
    message: 'All Bookings Fetched Successfully',
    count: bookings.length,
    data: bookings
  });
});


// GET
export const getMyBookings = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const myBookings = await bookingService.getMyBookings(userId);

  return res.status(200).json({
    success: true,
    message: 'My Bookings Fetched Successfully',
    count: myBookings.length,
    data: myBookings
  });
});


// POST
export const createBooking = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { resourceId, startDate, endDate } = req.body;

  const newBooking = await bookingService.createBooking({
    userId,
    resourceId,
    startDate,
    endDate
  });

  return res.status(201).json({
    success: true,
    message: 'Booking Created Successfully',
    data: newBooking
  });
});


// PATCH
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  const updatedStatus = { status };

  const updatedBookingStatus = await bookingService.updateBookingStatus({ bookingId, updatedStatus });

  return res.status(200).json({
    success: true,
    message: 'Booking Status Updated Succcessfully',
    data: updatedBookingStatus
  });
});


// DELETE
export const cancelBooking = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { _id: userId } = req.user;

  const cancelledBooking = await bookingService.cancelBooking(bookingId, userId);

  return res.status(200).json({
    success: true,
    message: 'Booking Cancelled Successfully',
    data: cancelledBooking
  });
});