const { Tour } = require('../models');
const { AppError, QueryBuilder, catchAsync } = require('../utils');
const { CODE, STATUS } = require('../constants');

exports.aliasTopTours = (req, res, next) => {
  const query = {
    limit: '5',
    sort: 'price,-ratingsAverage',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  req.query = query;
  next();
};

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 2.0 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = parseInt(req.params.year, 10);

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    data: {
      plan,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const qBuilder = new QueryBuilder(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(/** upperLim=*/ 100);

  // Execute query
  const tours = await qBuilder.query;

  // Submit response
  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new AppError(`No tour found with id ${req.params.id}`, CODE.NOT_FOUND)
    );
  }
  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(
      new AppError(`No tour found with id ${req.params.id}`, CODE.NOT_FOUND)
    );
  }
  res.status(CODE.OK).json({
    status: STATUS.SUCCESS,
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if (!tour) {
    return next(
      new AppError(`No tour found with id ${req.params.id}`, CODE.NOT_FOUND)
    );
  }
  res.status(CODE.NO_CONTENT).json({
    status: STATUS.SUCCESS,
    data: null,
  });
});
