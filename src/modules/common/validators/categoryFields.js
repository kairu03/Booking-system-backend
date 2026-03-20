import Joi from "joi";

export const categoryFields = {
  name: Joi.string().trim().min(4).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 4 characters',
  }),
  description: Joi.string().trim().max(100).messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description cannot exceed 100 characters',
  }),
  image: Joi.string().trim().pattern(/^https?:\/\/[^\s]+\.(jpg|jpeg|png|webp)$/i).messages({
    'string.base': 'Image must be a string',
    'string.pattern.base': 'Image must be a valid URL ending with .jpg, .jpeg, .png, or .webp',
  })
}