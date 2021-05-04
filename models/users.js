const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Parameter \'email\' should contain string with email!',
    },
  },
  password: {
    type: String,
    minlength: 9,
    select: false,
  },
});

function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .orFail(() => {
      throw createError(401);
    })
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(createError(401));
        }

        return user;
      }));
}

usersSchema.statics.findUserByCredentials = findUserByCredentials;
module.exports = mongoose.model('user', usersSchema);
