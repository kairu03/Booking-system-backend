import express from "express";
import { protectRoute } from '../../middlewares/authMiddleware.js';
import { authorizeRoles } from '../../middlewares/roleMiddleware.js';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "./categoryController.js";

const router = express.Router();

// add protecRoute to all routes
router.use(protectRoute);

router.get('/', getAllCategories);

router.get('/:id', getCategoryById);

router.post('/', authorizeRoles('admin') , createCategory);

router.put('/:id', authorizeRoles('admin'), updateCategory);

router.delete('/:id', authorizeRoles('admin'), deleteCategory);


export default router;