import express from "express";
import { protectRoute } from '../../middlewares/auth.js'
import { createResource, deleteResource, getAllResource, getResourceById, updateResource } from "./resourceController.js";
import { authorizeRoles } from "../../middlewares/role.js";
import { attachCategory } from "../../middlewares/attachCategory.js";
import { validate } from "../../middlewares/validate.js";
import { createResourceSchema, resourceParamsSchema, updateResourceSchema } from "./resourceValidation.js";

const router = express.Router({ mergeParams: true });

// add protecRoute to all routes
router.use(protectRoute);

router.get('/', getAllResource);

router.get('/:resourceId',
  validate(resourceParamsSchema, 'params'),
  getResourceById
);

router.post('/', 
  authorizeRoles('admin'), 
  attachCategory,
  validate(createResourceSchema),
  createResource
);

router.patch('/:resourceId', 
  authorizeRoles('admin'),
  validate(resourceParamsSchema, 'params'),
  validate(updateResourceSchema),
  updateResource
);

router.delete('/:resourceId', 
  authorizeRoles('admin'), 
  validate(resourceParamsSchema),
  deleteResource
);

export default router;