import express from "express";
import { protectRoute } from '../../middlewares/authMiddleware.js'
import { createResource, deleteResource, getAllResource, getResourceById, updateResource } from "./resourceController.js";
import { authorizeRoles } from "../../middlewares/roleMiddleware.js";
import { attachCategory } from "../../middlewares/categoryMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protectRoute);

router.get('/', getAllResource);

router.get('/:resourceId', getResourceById);

router.post('/', authorizeRoles('admin'), attachCategory, createResource);

router.put('/:resourceId', authorizeRoles('admin'), updateResource);

router.delete('/:resourceId', authorizeRoles('admin'), deleteResource);

export default router;