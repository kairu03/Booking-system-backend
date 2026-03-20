import Joi from "joi";
import { objectId } from "../common/validators/objectId.js";
import { categoryFields } from "../common/validators/categoryFields.js";

// for req.params.id - GET CategoryById && DELETE && PATCH
export const categoryParamsSchema = Joi.object({
  categoryId: objectId.required().messages({
    'any.required': 'Category Id is required',
  }),
});


// for req.body - POST Category
export const createCategorySchema = Joi.object({
  name: categoryFields.name.required().messages({
    'any.required': 'Category name is required'
  }),
  description: categoryFields.description.optional().allow('').messages({
    'string.max': 'Description cannot exceed 100 characters',
  }),
  image: categoryFields.image.optional().allow('').messages({ 
    'string.pattern.base': 'Image must be a valid URL ending with .jpg, .jpeg, .png, or .webp'
  }),
}); 


// for req.body - PATCH Category
export const updateCategorySchema = Joi.object({
  ...categoryFields,
}).min(1) // at least one field must be sent to update






