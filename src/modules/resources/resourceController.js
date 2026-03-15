import { asyncHandler } from '../../utils/asyncHandler.js';
import * as resourceService from '../../modules/resources/resourceService.js';


// GET 
export const getAllResource = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const resources = await resourceService.getAllResource(categoryId);

  return res.status(200).json({
    success: true,
    message: 'All Resource Fetched Successfully',
    count: resources.length,
    data: resources
  });
});


// GET
export const getResourceById = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;

  const resource = await resourceService.getResourceById(resourceId);

  return res.status(200).json({
    success: true,
    message: 'Resource Fetched Successfully',
    data: resource
  });
});


// POST
export const createResource = asyncHandler(async (req, res) => {
  const { category } = req;

  const { name, description, capacity, price, pricingType, amenities, images } = req.body;

  const newResource = await resourceService.createResource({
    name, 
    description,
    capacity,
    price, 
    pricingType, 
    amenities, 
    images,
    categoryId: category._id
  });
  
  return res.status(201).json({
    success: true,
    message: 'Resource Created Successfully',
    data: newResource
  });
});


// PUT
export const updateResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const { _id: userId } = req.user;

  const { name, description, capacity, price, pricingType, amenities, images } = req.body;

  const updated = { name, description, capacity, price, pricingType, amenities, images};

  const updatedResource = await resourceService.updateResource({
    resourceId,
    userId,
    updated
  });

  return res.status(200).json({
    success: true,
    message: 'Resource Updated Successfully',
    data: updatedResource
  });
});


// DELETE
export const deleteResource = asyncHandler(async (req, res) => {
  const { resourceId } = req.params;
  const { _id: userId } = req.user;

  const deletedResource = await resourceService.deleteResource(resourceId, userId);

  return res.status(200).json({
    success: true,
    message: 'Resource Deleted Successfully',
    data: deletedResource
  });
});