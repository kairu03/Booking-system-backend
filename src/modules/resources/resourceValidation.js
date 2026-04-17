import Joi from "joi";
import { objectId } from "../common/validators/objectId.js";
import { resourceFields } from "../common/validators/resourceFields.js";

// for req.params - GET ResourceById && PATCH && DELETE
export const resourceParamsSchema = Joi.object({
  resourceId: objectId.required().messages({
    'any.required': 'Resource Id is required',
  })
});


// for req.body - POST Resource
export const createResourceSchema = Joi.object({
  categoryId: Joi.string().hex().length(24).required().messages({
    'string.base': 'CategoryId must be a valid ID',
    'string.hex': 'CategoryId must be a valid hex string',
    'string.length': 'CategoryId must be 24 characters long',
    'any.required': 'CategoryId is required'
  }),
  ...resourceFields,
  name: resourceFields.name.required().messages({
    'any.required': 'Resource name is required'
  }),
  capacity: resourceFields.capacity.required().messages({
    'any.required': 'Capacity is required',
  }),
  price: resourceFields.price.required().messages({
    'any.required': 'Price is required',
  }),
  pricingType: resourceFields.pricingType.required().messages({
    'any.required': 'Pricing type is required'
  }),
  description: resourceFields.description.optional().allow(''),
  amenities: resourceFields.amenities.optional().allow(''),
  images: resourceFields.images.optional().allow(''),
});


// for req.body PATCH Resource
export const updateResourceSchema = Joi.object({
  ...resourceFields,
}).min(1) // at least 1 field must be sent to update