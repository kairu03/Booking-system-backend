import { ApiError } from "../../utils/apiError.js";
import User from "../users/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const userRegister = async ({ name, email, password }) => {

  // check if user's email already exists in DB
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError('User already exists', 400);
  }

  // create new user in DB
  const newUser = await User.create({
    name,
    email,
    password
  });

  // create a token
  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    token
  }
}


export const userLogin = async ({ email, password }) => {

  // check if user's email already exists in DB
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError('Invalid input', 400);
  }

  // check if user's password match the one in DB
  const isPassword = await bcrypt.compare(password, user.password)
  if (!isPassword) {
    throw new ApiError('Invalid password', 400);
  }

  // create token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  }
}