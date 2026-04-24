import express from "express";
import { protectRoute } from '../../middlewares/auth.js'
import { createResource, deleteResource, getResourceById, updateResource } from "./resourceController.js";
import { authorizeRoles } from "../../middlewares/role.js";
import { validate } from "../../middlewares/validate.js";
import { createResourceSchema, resourceParamsSchema, updateResourceSchema } from "./resourceValidation.js";

const router = express.Router();

router.get('/:resourceId',
  validate(resourceParamsSchema, 'params'),
  getResourceById
);

router.post('/', 
  protectRoute,
  authorizeRoles('admin'), 
  validate(createResourceSchema),
  createResource
);

router.patch('/:resourceId', 
  protectRoute,
  authorizeRoles('admin'),
  validate(resourceParamsSchema, 'params'),
  validate(updateResourceSchema),
  updateResource
);

router.delete('/:resourceId', 
  protectRoute,
  authorizeRoles('admin'), 
  validate(resourceParamsSchema, 'params'),
  deleteResource
);

export default router;