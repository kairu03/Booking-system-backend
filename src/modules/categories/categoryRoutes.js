import express from "express";
import { protectRoute } from '../../middlewares/auth.js';
import { authorizeRoles } from '../../middlewares/role.js';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "./categoryController.js";
import { validate } from "../../middlewares/validate.js";
import { categoryParamsSchema, createCategorySchema, updateCategorySchema } from "./categoryValidation.js";
import { getAllResourceByCategory } from "../resources/resourceController.js";

const router = express.Router();

router.get('/', getAllCategories);

router.get('/:categoryId', 
  validate(categoryParamsSchema, 'params'), 
  getCategoryById
);

router.post('/',  
  protectRoute,
  authorizeRoles('admin'),
  validate(createCategorySchema), 
  createCategory
);

router.patch('/:categoryId',
  protectRoute,
  authorizeRoles('admin'), 
  validate(categoryParamsSchema, 'params'),
  validate(updateCategorySchema),
  updateCategory
);

router.delete('/:categoryId', 
  protectRoute,
  authorizeRoles('admin'),
  validate(categoryParamsSchema, 'params'), 
  deleteCategory);

// GET all resource by category
router.get('/:categoryId/resources', getAllResourceByCategory);

export default router; 