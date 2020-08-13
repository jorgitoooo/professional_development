const { CODE, STATUS } = require('../constants');

function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || CODE.SERVER_ERROR;
  err.status = err.status || STATUS.ERROR;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
  next();
}

module.exports = {
  errorHandler,
};
