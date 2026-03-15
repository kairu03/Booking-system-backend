import express from "express";
import { protectRoute } from '../../middlewares/authMiddleware.js';
import { authorizeRoles } from '../../middlewares/roleMiddleware.js';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "./categoryController.js";
import resourceRoutes from '../../modules/resources/resourceRoutes.js';

const router = express.Router();

// add protecRoute to all routes
router.use(protectRoute);

router.get('/', getAllCategories);

router.get('/:categoryId', getCategoryById);

router.post('/', authorizeRoles('admin') , createCategory);

router.put('/:categoryId', authorizeRoles('admin'), updateCategory);

router.delete('/:categoryId', authorizeRoles('admin'), deleteCategory);

// any route like /categories/:categoryId/resources will go to resourceRoutes
router.use('/:categoryId/resources', resourceRoutes);

export default router;