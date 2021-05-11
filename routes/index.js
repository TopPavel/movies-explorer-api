const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const createError = require('http-errors');
const usersRouter = require('./users');
const cardsRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(9),
  }).unknown(true),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(9),
    name: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', cardsRouter);

router.use((req, res, next) => {
  next(createError(404, { message: `${req.method} ${req.url} not found` }));
});

module.exports = router;
