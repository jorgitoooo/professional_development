const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const { errorController } = require('./controllers');
const { reviewRouter, userRouter, tourRouter } = require('./routes');
const { AppError } = require('./utils');
const { CODE, WHITELIST } = require('./constants');

const app = express();

// 1) MIDDLEWARES
// Set security headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP. Please try again in an hour.',
});
app.use('/api', limiter);

// Body parser, sets req.body with data from body of request
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevents parameter pollution
app.use(
  hpp({
    whitelist: WHITELIST.PARAMS,
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use('/api/v1/reviews', reviewRouter);
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
