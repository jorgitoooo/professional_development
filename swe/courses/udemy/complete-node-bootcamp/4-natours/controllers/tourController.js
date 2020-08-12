const Tour = require('../models/tourModel');
const { STATUS } = require('../constants');

exports.getAllTours = async (req, res) => {
  try {
    // Build query object
    // 1) Filter query
    let queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    let query = Tour.find(queryObj);

    // 2) Sorting
    let sortBy;
    if (req.query.sort) {
      sortBy = req.query.sort.split(',').join(' ');
    } else {
      sortBy = '-ratingsAverage -ratingsQuantity';
    }
    query = query.sort(sortBy);

    // 3) Field limiting
    let fields = '';
    if (req.query.fields) {
      fields = req.query.fields.split(',').join(' ');
    } else {
      fields = fields.concat('-__v');
    }

    // Removes '__v' field from query
    if (!fields.includes('-__v')) {
      if (fields.includes('__v')) {
        fields = fields.replace('__v', '-__v');
      } else {
        fields = fields.concat(' -__v');
      }
    }
    console.log(fields);
    query = query.select(fields);

    // 4) Pagination
    let page = parseInt(req.query.page, 10) || 1;
    let lim = parseInt(req.query.limit, 10) || 10;
    if (page < 1) {
      page = 1;
    }
    if (lim < 1) {
      lim = 1;
    }

    const skip = (page - 1) * lim;

    const numTours = await Tour.countDocuments();
    if (skip >= numTours) {
      throw new Error('This page does not exist');
    }

    query = query.skip(skip).limit(lim);

    // Execute query
    const tours = await query;

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
