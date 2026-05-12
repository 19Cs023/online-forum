
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';
import dotenv from 'dotenv';
import { catchAsync } from '../utils/catchAsync.js';
import { errorHandler } from '../middlewares/error.middleware.js';

dotenv.config();

const signin = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ 'email': req.body.email });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    return errorHandler(error, req, res, next);
  }
  
  if (!user.authenticate(req.body.password)) {
    const error = new Error('Email and password don\'t match.');
    error.statusCode = 401;
    return errorHandler(error, req, res, next);
  }
  
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res.cookie('t', token, { expire: new Date() + 9999 });
  return res.json({ token, user: { _id: user._id, name: user.name, email: user.email }});
});

const signout = (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({ message: 'signed out' });
};

const requireSignin = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth'
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!(authorized)) {
    return res.status('403').json({ error: 'User is not authorized' });
  }
  next();
};

export default { signin, signout, requireSignin, hasAuthorization };
