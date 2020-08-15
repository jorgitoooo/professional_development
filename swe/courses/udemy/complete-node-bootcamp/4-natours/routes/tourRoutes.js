const express = require('express');
const { authController, tourController } = require('../controllers');

const { ROLE } = require('../constants');

const router = express.Router();

// Middleware on params
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheapest')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo(ROLE.ADMIN, ROLE.LEAD_GUIDE),
    tourController.deleteTour
  );

module.exports = router;
