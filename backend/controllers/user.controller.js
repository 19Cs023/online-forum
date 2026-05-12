import User from '../models/user.js'
import extend from 'lodash/extend.js'
import { catchAsync } from '../utils/catchAsync.js';
import { errorHandler } from '../middlewares/error.middleware.js';

const create = catchAsync(async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return errorHandler(err, req, res, next)
  }
})

/**
 * Load user and append to req.
 */
const userByID = catchAsync(async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user
    next()
  } catch (err) {
    return errorHandler(err, req, res, next)
  }
})

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = catchAsync(async (req, res) => {
  try {
    let users = await User.find().select('name email updated created')
    res.json(users)
  } catch (err) {
    return errorHandler(err, req, res, next)
  }
})

const update = catchAsync(async (req, res) => {
  try {
    let user = req.profile
    user = extend(user, req.body)
    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return errorHandler(err, req, res, next)
  }
})

const remove = catchAsync(async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()
    deletedUser.hashed_password = undefined
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return errorHandler(err, req, res, next)
  }
})

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update
}  