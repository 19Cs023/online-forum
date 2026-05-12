import express from 'express'
import rateLimit from 'express-rate-limit'
import authCtrl from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.js'
import { userLoginSchema } from '../validators/auth.validator.js'

const router = express.Router()

// Limit login attempts to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

router.route('/api/auth/signin')
  .post(loginLimiter, validate(userLoginSchema), authCtrl.signin)
router.route('/api/auth/signout')
  .get(authCtrl.signout)

export default router