import { ApiError } from "../utils/apiError.js";

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError('Not authenticated', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError('You do not have permission to access this resource', 403);
    }
    
    next();
  }
}