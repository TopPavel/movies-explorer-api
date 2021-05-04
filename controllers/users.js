const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { handleError } = require('../middlewares/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

function processingUserWithHandleError(method, params) {
  method.orFail(() => {
    throw createError(404, { message: `User with id = ${params.userId} not found!` });
  })
    .then((data) => params.res.send({ data }))
    .catch((err) => handleError(err, params.req, params.res));
}

module.exports.createUser = (req, res) => {
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
    .catch((err) => handleError(err, req, res));
};

module.exports.getUserFromToken = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw createError(401);
    })
    .then((data) => res.send({ data }))
    .catch((err) => handleError(err, req, res));
};

module.exports.updateUserInfo = (req, res) => {
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
  );
};

module.exports.login = (req, res) => {
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
    .catch((err) => handleError(err, req, res));
};
