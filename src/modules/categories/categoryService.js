import { ApiError } from "../../utils/apiError.js";
import Category from '../../modules/categories/categoryModel.js';


// GET 
export const getAllCategories = async () => {
  const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });

  return categories;
}


// GET
export const getCategoryById = async (categoryId) => {
  const category = await Category.findOne({ _id: categoryId, isActive: true });

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  return category;
}


// POST
export const createCategory = async ({ name, description, image, user }) => {
  const category = await Category.findOne({ name });

  if (category) {
    throw new ApiError('Category already exists', 400);
  }

  const newCategory = new Category({
    name,
    description,
    image,
    user
  });

  await newCategory.save();

  return newCategory;
}


// PATCH
export const updateCategory = async ({ categoryId, userId, updated }) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  const updates = {
    ...(updated.name !== undefined && { name: updated.name }),
    ...(updated.description !== undefined && { description: updated.description }),
    ...(updated.image !== undefined && { image: updated.image }),
    ...(updated.isActive !== undefined && { isActive: updated.isActive })
  }

  Object.assign(category, updates);

  await category.save();

  return category;
}


// DELETE
export const deleteCategory = async (categoryId, userId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  category.isActive = false;

  await category.save();

  return category;
}