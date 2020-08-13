const { AppError } = require('../utils');
const { CODE, STATUS } = require('../constants');

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  let error = new AppError(message, CODE.BAD_REQUEST);
  //   error = Object.assign(error, err);
  return error;
}

function handleDuplicateFieldsErrorDB(err) {
  let values = Object.values(err.keyValue).map((val) => `"${val}"`);
  values = values.join(',');

  const message = `Duplicate field value(s) [${values}]. Please use another value.`;

  let error = new AppError(message, CODE.BAD_REQUEST);
  //   error = Object.assign(error, err);

  return error;
}

function handleValidationErrorDB(err) {
  const values = Object.values(err.errors).map((error) => error.message);

  const message = `Invalid input data. ${values.join('. ')}`;

  let error = new AppError(message, CODE.BAD_REQUEST);
  //   error = Object.assign(error, err);

  return error;
}

function sendErrorDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

function sendErrorProd(err, res) {
  if (err.isOperational) {
    // Operational/trusted error
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming/other unknown error
    // console.error('ERROR 🧨💥', err);

    res.status(CODE.SERVER_ERROR).json({
      status: STATUS.ERROR,
      message: 'Something went horribly wrong.',
    });
  }
}

function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || CODE.SERVER_ERROR;
  err.status = err.status || STATUS.ERROR;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // spread operator doesn't call setters on the object's prototypes
    let error = Object.assign(err);

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldsErrorDB(error);
    }

    sendErrorProd(error, res);
  }
  next();
}

module.exports = {
  errorHandler,
};
