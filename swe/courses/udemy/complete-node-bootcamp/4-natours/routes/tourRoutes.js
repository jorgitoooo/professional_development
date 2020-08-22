const express = require('express');
const reviewRouter = require('./reviewRoutes');
const { authController, tourController } = require('../controllers');

const { ROLE } = require('../constants');

const router = express.Router();

// Middleware on params
// router.param('id', tourController.checkID);

// Nested route
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheapest')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo(ROLE.ADMIN, ROLE.LEAD_GUIDE, ROLE.GUIDE),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo(ROLE.ADMIN, ROLE.LEAD_GUIDE),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo(ROLE.ADMIN, ROLE.LEAD_GUIDE),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo(ROLE.ADMIN, ROLE.LEAD_GUIDE),
    tourController.deleteTour
  );

module.exports = router;
