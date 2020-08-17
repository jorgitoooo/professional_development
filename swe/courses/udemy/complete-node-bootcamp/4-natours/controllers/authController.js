const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { AppError, catchAsync, sendEmail } = require('../utils');
const { CODE, STATUS } = require('../constants');

const EXPIRES_IN_MS = process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000;

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function signAndSendToken(user, statusCode, res) {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + EXPIRES_IN_MS),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  // Removes password from user obj.
  user.password = undefined;

  res.status(CODE.CREATED).json({
    status: STATUS.SUCCESS,
    token,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
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

  signAndSendToken(newUser, CODE.CREATED, res);
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
  signAndSendToken(user, CODE.OK, res);
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user for 'email'
  const user = await User.findOne({ email: { $eq: req.body.email } });
  if (!user) {
    return next(new AppError('User not found', CODE.NOT_FOUND));
  }

  // Generate password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send reset token to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `
  Seems like you forgot your password. Please submit a PATCH
  request with your new password and a confirmation of your
  password to: ${resetURL}.
  
  If you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token (valid for 10 minutes)',
      message,
    });

    res.status(CODE.OK).json({
      status: STATUS.SUCCESS,
      message: 'Reset token sent by email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(err);

    return next(
      new AppError(
        'There was an error sending the email. Please try again later.',
        CODE.SERVER_ERROR
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  const resetToken = req.params.token;
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // Set new password if user exists and token didn't expire
  if (!user) {
    return next(
      new AppError(
        'Token is invalid or has expired. Try resetting your password again.',
        CODE.BAD_REQUEST
      )
    );
  }

  // Update changed password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Log user in, send JWT
  signAndSendToken(user, CODE.OK, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user
  const user = await User.findById(req.user._id).select('+password');
  const match = await user.passwordMatch(
    req.body.currentPassword,
    user.password
  );
  if (!match) {
    return next(new AppError('Password does not match', CODE.BAD_REQUEST));
  }

  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Generate JWT and send to user
  signAndSendToken(user, CODE.OK, res);
});
