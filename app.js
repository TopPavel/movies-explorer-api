const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const { handleError } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { NODE_ENV, HOST_DB, PORT } = process.env;

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/movies');

const app = express();

mongoose.connect(`mongodb://${NODE_ENV === 'production' ? HOST_DB : 'localhost'}:27017/bitfilmsdb`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://mov-explorer.toppavel.nomoredomains.icu', 'https://mov-explorer.toppavel.nomoredomains.icu'],
  // origin: '*',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(9),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(9),
  }).unknown(true),
}), createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/movies', cardsRouter);

app.use(errorLogger);

app.use((req, res, next) => {
  next(createError(404, { message: `Url ${req.url} not found` }));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  handleError(err, req, res);
});

if (NODE_ENV === 'production') {
  app.listen(PORT);
} else {
  app.listen(8085);
}

module.exports = app;
