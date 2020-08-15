const { promisify } = require('util');
const jwt = require('jsonwebtoken');

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
    role: req.body.role,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedDate: req.body.passwordChangedDate, // TEMP:
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

exports.protect = catchAsync(async (req, res, next) => {
  // Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Test if token exists
  if (!token) {
    return next(
      new AppError(
        'You are not logged in. Please log in to get access.',
        CODE.UNAUTHORIZED
      )
    );
  }

  // Verify validity of token
  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user exists
  const user = await User.findById(payload.id);
  if (!user) {
    return next(
      new AppError(
        'The user belonging to this token does not exist.',
        CODE.UNAUTHORIZED
      )
    );
  }

  if (user.changedPasswordAfter(payload.iat)) {
    return next(
      new AppError(
        'Password was changed after token was created. Please log in again.',
        CODE.UNAUTHORIZED
      )
    );
  }

  // Grant access to protected route
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log('-- FORBIDDEN');
      return next(
        new AppError(
          'You do not have permission to perform this action',
          CODE.FORBIDDEN
        )
      );
    }
    next();
  };
};
