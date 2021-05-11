const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { mapError } = require('../middlewares/mapError');

const { NODE_ENV, JWT_SECRET } = process.env;

function processingUserWithHandleError(method, params, next) {
  method.orFail(() => {
    throw createError(404, { message: `User with id = ${params.userId} not found!` });
  })
    .then((data) => params.res.send({ data }))
    .catch((err) => next(mapError(err)));
}

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((data) => res.send({
      name: data.name, email: data.email,
    }))
    .catch((err) => next(mapError(err)));
};

module.exports.getUserFromToken = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw createError(401);
    })
    .then((data) => res.send({ data }))
    .catch((err) => next(mapError(err)));
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  processingUserWithHandleError(
    User.findByIdAndUpdate(req.user._id, {
      name,
      email,
    }),
    {
      req,
      res,
      userId: req.user._id,
    },
    next,
  );
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(mapError(err)));
};
