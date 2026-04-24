
import Joi from "joi";
import { objectId } from "../common/validators/objectId.js";

// for req.params
export const bookingParamsSchema = Joi.object({
  bookingId: objectId.required().messages({
    'any.required': 'Booking Id is required'
  }),
});


// for req.body - POST Booking
export const createBookingSchema = Joi.object({
   resourceId: Joi.string().length(24).hex().required().messages({
    'string.base': 'Resource Id must be a string',
    'any.required': 'Resource Id is required',
    'string.length': 'Invalid ResourceId',
    'string.hex': 'Invalid ResourceId'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
    'date.format': 'Start date must be a valid date'
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
    'date.base': 'End date must be a valid date',
    'any.required': 'End date is required',
    'date.greater': 'End date must be greater than start date',
  }),
});


// for req.body - PATCH Booking
export const updateBookingSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required().messages({
    'any.required': 'Status is required',
    'any.only': 'Invalid booking status'
  }),
});


// .iso() validates it as a date string in ISO format: 2026-03-20T10:00:00.000Z
// .greater is to check if endDate is > the reference(startDate)