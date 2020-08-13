const express = require('express');
const morgan = require('morgan');

const { errorController } = require('./controllers');
const { userRouter, tourRouter } = require('./routes');
const { AppError } = require('./utils');
const { CODE } = require('./constants');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(
    `${req.originalUrl} is not a valid endpoint`,
    CODE.NOT_FOUND
  );
  next(err);
});

app.use(errorController.errorHandler);

module.exports = app;
