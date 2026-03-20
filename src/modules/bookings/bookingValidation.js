
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
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
    'date.base': 'Start date must be a valid date',
    'any.required': 'Start date is required',
    'date.greater': 'End date must be after start date',
  }),
});


// for req.body - PATCH Booking
export const updateBookingSchema = Joi.object({
  startDate: Joi.date().iso().optional().messages({
    'date.base': 'Start date must be a valid date'
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional().messages({
    'date.base': 'End date must be a valid date',
    'date.greater': 'End date must be after start date',
  }),
}).min(1) // at least 1 field must be sent to update


// .iso() validates it as a date string in ISO format: 2026-03-20T10:00:00.000Z
// .greater is to check if endDate is > the reference(startDate)