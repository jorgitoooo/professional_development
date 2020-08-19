const { AppError, QueryBuilder, catchAsync } = require('../utils');
const { CODE, STATUS } = require('../constants');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(
        new AppError(
          `No document found with id ${req.params.id}`,
          CODE.NOT_FOUND
        )
      );
    }
    res.status(CODE.NO_CONTENT).json({
      status: STATUS.SUCCESS,
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError(
          `No document found with id ${req.params.id}`,
          CODE.NOT_FOUND
        )
      );
    }
    res.status(CODE.OK).json({
      status: STATUS.SUCCESS,
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(CODE.CREATED).json({
      status: STATUS.SUCCESS,
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOpts) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOpts) {
      query = query.populate(popOpts);
    }
    const doc = await query;

    if (!doc) {
      return next(
        new AppError(
          `No document found with id ${req.params.id}`,
          CODE.NOT_FOUND
        )
      );
    }
    res.status(CODE.OK).json({
      status: STATUS.SUCCESS,
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // Needed for nested GET in tour route (hack)
    let queryObj = {};
    if (req.params.tourId) {
      queryObj = { tour: req.params.tourId };
    }
    const qBuilder = new QueryBuilder(Model.find(queryObj), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(/** upperLim=*/ 100);

    // Execute query
    const docs = await qBuilder.query;

    // Submit response
    res.status(CODE.OK).json({
      status: STATUS.SUCCESS,
      results: docs.length,
      data: {
        docs,
      },
    });
  });
