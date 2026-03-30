import express from "express";
import { userLogin, userRegister } from "./authController.js";
import { loginSchema, registerSchema } from "./authValidation.js";
import { validate } from "../../middlewares/validate.js";
import { loginLimiter, registerLimiter } from '../../middlewares/ratelimit/authLimiter.js';

const router = express.Router()

if (process.env.NODE_ENV !== 'test') {
  router.use('/login', loginLimiter)
  router.use('/register', registerLimiter)
}

router.post('/login', validate(loginSchema), userLogin);
router.post('/register', validate(registerSchema), userRegister);

export default router;