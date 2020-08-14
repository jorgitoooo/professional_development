const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { catchAsync } = require('../utils');
const { CODE, STATUS } = require('../constants');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  console.log(process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(CODE.CREATED).json({
    status: STATUS.SUCCESS,
    token,
    data: {
      user: newUser,
    },
  });
});
