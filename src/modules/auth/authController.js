import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from '../../modules/auth/authService.js'

export const userRegister = asyncHandler(async (req, res) => {

  // extract name, email, password from req body
  const { name, email, password } = req.body;

  // create new user
  const { user, token } = await authService.userRegister({
    name,
    email,  
    password
  });

  // return user info to frontend with token
  return res.status(201).json({
    success: true,
    message: 'Register successful',
    data: {
      user,
      token
    }
  });
});


export const userLogin = asyncHandler(async (req, res) => {

  // extract email, password form req body
  const { email, password } = req.body;

  const { user, token } = await authService.userLogin({
    email,
    password
  });

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
});