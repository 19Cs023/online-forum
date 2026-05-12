import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.js'
import { userRegistrationSchema } from '../validators/auth.validator.js'

const router = express.Router()

router.route('/api/users')
  .get(userCtrl.list)
  .post(validate(userRegistrationSchema), userCtrl.create)

router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.param('userId', userCtrl.userByID)

export default router