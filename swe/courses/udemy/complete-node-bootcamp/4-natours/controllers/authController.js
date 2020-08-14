const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('../models');
const { AppError, catchAsync } = require('../utils');
const { CODE, STATUS } = require('../constants');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(CODE.CREATED).json({
    status: STATUS.SUCCESS,
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Test form email & password
  if (!email || !password) {
    return next(
      new AppError('Please provide an email and password', CODE.BAD_REQUEST)
    );
  }

  // 2) Make sure user exists
  // select() has to be used b/c the password field is omitted by default
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.passwordMatch(password, user.password))) {
    return next(new AppError('Incorrect email or password', CODE.UNAUTHORIZED));
  }

  // 3) Generate token and response
  const token = signToken(user._id);

  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    token,
  });
});
