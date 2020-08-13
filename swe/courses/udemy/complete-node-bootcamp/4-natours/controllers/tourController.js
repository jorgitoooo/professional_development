const Tour = require('../models/tourModel');
const { QueryBuilder } = require('../utils');
const { STATUS } = require('../constants');

exports.aliasTopTours = (req, res, next) => {
  const query = {
    limit: '5',
    sort: 'price,-ratingsAverage',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  };
  req.query = query;
  next();
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
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

    res.status(200).json({
      status: STATUS.SUCCESS,
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  const year = parseInt(req.params.year, 10);

  try {
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

    res.status(200).json({
      status: STATUS.SUCCESS,
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const qBuilder = new QueryBuilder(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const tours = await qBuilder.query;

    // Submit response
    res.status(200).json({
      status: STATUS.SUCCESS,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: STATUS.SUCCESS,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: STATUS.SUCCESS,
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: STATUS.SUCCESS,
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: STATUS.SUCCESS,
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: STATUS.FAIL,
      message: err,
    });
  }
};
