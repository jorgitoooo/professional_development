const express = require('express');
const { authController, userController } = require('../controllers');
const { ROLE } = require('../constants');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// All routes below this middleware require authentication
router.use(authController.protect);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// All routes below this middleware can only be accessed by an admin
router.use(authController.restrictTo(ROLE.ADMIN));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
