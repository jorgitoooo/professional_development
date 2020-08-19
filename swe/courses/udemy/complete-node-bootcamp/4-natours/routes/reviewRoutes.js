const express = require('express');
const { authController, reviewController } = require('../controllers');
const { ROLE } = require('../constants');

const router = express.Router({ mergeParams: true });

// All routes below this middleware require authentication
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo(ROLE.USER),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo(ROLE.USER, ROLE.ADMIN),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo(ROLE.USER, ROLE.ADMIN),
    reviewController.deleteReview
  );

module.exports = router;
