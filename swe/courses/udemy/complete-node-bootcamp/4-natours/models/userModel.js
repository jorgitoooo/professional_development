const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, /** salt=*/ 12);
    this.passwordConfirm = undefined; // Only used to confirm equal pwd
  }
  next();
});

userSchema.methods.passwordMatch = async function (candidatePwd, userPwd) {
  return await bcrypt.compare(candidatePwd, userPwd);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
