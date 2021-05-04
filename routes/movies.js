const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  deleteMovieById,
  getMovies,
  createMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().uri({ scheme: ['http', 'https', 'sftp'] }),
    trailer: Joi.string().required().uri({ scheme: ['http', 'https', 'sftp'] }),
    thumbnail: Joi.string().required().uri({ scheme: ['http', 'https', 'sftp'] }),
    movieId: Joi.string().required().hex().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }).unknown(true),
}), deleteMovieById);

module.exports = router;
