const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { ROLE } = require('../constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address'],
  },
  photo: String,
  role: {
    type: String,
    enum: [ROLE.USER, ROLE.GUIDE, ROLE.LEAD_GUIDE, ROLE.ADMIN],
    default: ROLE.USER,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (pwd) {
        // Validator only runs on create() & save()
        return pwd === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedDate: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, /** salt=*/ 12);
    this.passwordConfirm = undefined; // Only used to confirm equal pwd
  }
  next();
});

userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew) {
    // Ensures that the JWT is created after th password has been changed
    this.passwordChangedDate = Date.now() - 1000;
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  this.where({ active: { $ne: false } });
  next();
});

userSchema.methods.passwordMatch = async function (candidatePwd, userPwd) {
  return await bcrypt.compare(candidatePwd, userPwd);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedDate) {
    const changedTimestamp = parseInt(
      this.passwordChangedDate.getTime() / 1000,
      10
    ); // JWT timestamp comes in seconds
    return changedTimestamp > JWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
