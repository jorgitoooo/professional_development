const { Review } = require('../models');
const { catchAsync } = require('../utils');
const { CODE, STATUS } = require('../constants');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(CODE.CREATED).json({
    status: CODE.SUCCESS,
    data: {
      review: newReview,
    },
  });
});
