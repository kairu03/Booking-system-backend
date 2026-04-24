import express from "express";
import { userLogin, userRegister } from "./authController.js";
import { loginSchema, registerSchema } from "./authValidation.js";
import { validate } from "../../middlewares/validate.js";
import { loginLimiter, registerLimiter } from '../../middlewares/ratelimit/authLimiter.js';

const router = express.Router()

router.post('/login', loginLimiter, validate(loginSchema), userLogin);
router.post('/register', registerLimiter, validate(registerSchema), userRegister);

export default router;