const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const limiter = require('./config/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const celebrateErrors = require('./middlewares/celebrate');
const errorsHandler = require('./middlewares/errorsHandler');

const { NODE_ENV, DB_CONFIG, PORT } = process.env;

const router = require('./routes/index');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? DB_CONFIG : 'mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://mov-explorer.toppavel.nomoredomains.icu', 'https://mov-explorer.toppavel.nomoredomains.icu'],
  // origin: '*',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);
app.use('/', router);
app.use(errorLogger);
app.use(celebrateErrors);
app.use(errorsHandler);

app.listen(NODE_ENV === 'production' ? PORT : 8085);

module.exports = app;
