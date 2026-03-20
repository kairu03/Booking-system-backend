import Joi from "joi";

export const resourceFields = {
  name: Joi.string().trim().min(4).messages({
    'string.base': 'Name must be a string',
    'sting.min': 'Name must be at least 4 characters',
  }),
  description: Joi.string().trim().max(100).messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description cannot exceed 100 characters',
  }),
  capacity: Joi.number().integer().min(1).max(1000).messages({
    'number.base': 'Capacity must be a number',
    'number.integer': 'Capacity must be a whole number',
    'number.min': 'Capacity must be at least 1',
    'number.max': 'Capacity cannot exceed 1000',
  }),
  price: Joi.number().min(100).precision(2).messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least 100',
  }),
  pricingType: Joi.string().trim().valid('day', 'hourly').messages({
    'string.base': 'Pricing type must be a string',
    'any.only': 'Pricing type must either be day or hourly',
  }),
  amenities: Joi.array().items(Joi.string().trim()).messages({
    'array.base': 'Amenities must be an array of strings',
    'string.base': 'Each amenity must be a string',
  }),
  images: Joi.array().items(
    Joi.string()
    .trim()
    .pattern(/^https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)$/i)
  ).messages({
    'array.base': 'Images must be an array of strings',
    'string.base': 'Each image must be a string',
    'string.pattern.base': 'Each image must be a valid URL ending with .jpg, .jpeg, .png, or .webp',
  }),
};