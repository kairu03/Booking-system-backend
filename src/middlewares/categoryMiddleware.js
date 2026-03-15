import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import Category from "../modules/categories/categoryModel.js";


// get category and attach it to req category for resource ownership
export const attachCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  // attach category to req
  req.category = category;

  next();
})