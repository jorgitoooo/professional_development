const { User } = require('../models');
const { CODE, STATUS } = require('../constants');
const { AppError, catchAsync } = require('../utils');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // Submit response
  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    results: users.length,
    data: {
      users,
    },
  });
});

function filterObj(obj, ...fields) {
  const res = {};
  fields.forEach((field) => {
    if (field in obj) {
      res[field] = obj[field];
    }
  });
  // Object.keys(obj).forEach((field) => {
  //   if (fields.includes(field)) {
  //     res[field] = obj[field];
  //   }
  // });
  return res;
}

exports.updateMe = catchAsync(async (req, res, next) => {
  // Password cannot be updated in this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updatePassword',
        CODE.BAD_REQUEST
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log(req.user, filteredBody);
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(CODE.NO_CONTENT).json({
    status: STATUS.SUCCESS,
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
