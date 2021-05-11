const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  updateUserInfo,
  getUserFromToken,
} = require('../controllers/users');

router.get('/me', getUserFromToken);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), updateUserInfo);

module.exports = router;
