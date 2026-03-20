import Joi from "joi";

export const objectId = Joi.string().length(24).hex().messages({
  'string.base': 'Invalid Id',
  'string.length': 'Invalid Id',
  'string.hex': 'Invalid id',
});