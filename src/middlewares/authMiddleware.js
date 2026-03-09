import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import jwt from 'jsonwebtoken';
import User from "../modules/users/userModel.js";

export const protectRoute = asyncHandler(async (req, res, next) => {

  //extract authorization headers from the req (contains bearer token)
  const authHeader = req.headers.authorization;

  // check if token exists
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    throw new ApiError('Not authorized, token missing', 401);
  }

  // extract actual token
  const token = authHeader.split(' ')[1];

  // verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError('Not authorized, invalid token', 401);
  }

  // find authenticated user by Id
  const user = await User.findById(decoded.id);

  // attach user info to request object
  req.user = user;

  // call next() to continue to route
  next();
});

