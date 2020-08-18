const express = require('express');
const { authController, reviewController } = require('../controllers');
const { ROLE } = require('../constants');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo(ROLE.USER),
    reviewController.createReview
  );

module.exports = router;
