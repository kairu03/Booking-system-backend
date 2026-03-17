import { ApiError } from '../../utils/apiError.js';
import Resource from "./resourceModel.js";
import Category from '../categories/categoryModel.js';


// GET 
export const getAllResource = async (categoryId) => {
  const resources = await Resource.find({ category: categoryId, isActive: true })

  return resources;
} 


// GET
export const getResourceById = async (resourceId) => {
  const resource = await Resource.findOne({ _id: resourceId, isActive: true });

  if (!resource) {
    throw new ApiError('Resource not found', 404);
  }

  return resource;
}


// POST
export const createResource = async ({ name, description, capacity, price, pricingType, amenities, images, categoryId }) => {
  
  const newResource = await Resource.create({
    name,
    description,
    capacity,
    price,
    pricingType,
    amenities,
    images,
    category: categoryId
  });

  return newResource;
};


// PATCH
export const updateResource = async ({ resourceId, userId, updated }) => {
  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError('Resource not found', 404);
  }

  const category = await Category.findById(resource.category);

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  if (!category.user.equals(userId)) {
    throw new ApiError('Not authorized', 403)
  }

  const updates = {
    ...(updated.name !== undefined && { name: updated.name }),
    ...(updated.description !== undefined && { description: updated.description }),
    ...(updated.capacity !== undefined && { capacity: updated.capacity}),
    ...(updated.price !== undefined && { price: updated.price }),
    ...(updated.pricingType !== undefined && { pricingType: updated.pricingType }),
    ...(updated.amenities !== undefined && { amenities: updated.amenities }),
    ...(updated.images !== undefined && { images: updated.images })
  }

  const updatedResource = await Resource.findByIdAndUpdate(
    resourceId, 
    updates, 
    { new: true, runValidators: true }
  );

  return updatedResource;
}


// DELETE
export const deleteResource = async (resourceId, userId) => {
  const resource = await Resource.findById(resourceId);

  if (!resource) {
    throw new ApiError('Resource not found', 404);
  }

  const category = await Category.findById(resource.category);

  if (!category) {
    throw new ApiError('Category not found', 404);
  }

  if (!category.user.equals(userId)) {
    throw new ApiError('Not authorized', 403)
  }

  const deletedResource = await Resource.findByIdAndDelete(resourceId);

  return deletedResource;
}