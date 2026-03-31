import { asyncHandler } from "../../utils/asyncHandler.js";
import * as categoryService from '../../modules/categories/categoryService.js';


// GET
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();

  return res.status(200).json({
    success: true,
    message: 'All Categories Fetched Successfully',
    count: categories.length,
    data: categories
  });
});


// GET
export const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.getCategoryById(categoryId);

  return res.status(200).json({
    success: true,
    message: 'Category Fetched Successfully',
    data: category
  });
});


// POST
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;

  const newCategory = await categoryService.createCategory({
    name, 
    description,
    image,
    user: req.user._id
  });

  return res.status(201).json({
    success: true,
    message: 'Category Created Successfully',
    data: newCategory
  });
});


// PATCH
export const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const { name, description, image, isActive } = req.body;

  const updated = { name, description, image, isActive };

  const updatedCategory = await categoryService.updateCategory({
    categoryId,
    updated
  });

  return res.status(200).json({
    success: true,
    message: 'Category Updated Successfully',
    data: updatedCategory
  });
});


// DELETE
export const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const deletedCategory = await categoryService.deleteCategory(categoryId);

  return res.status(200).json({
    success: true,
    message: 'Category Deleted Successfully',
    data: deletedCategory
  });
});