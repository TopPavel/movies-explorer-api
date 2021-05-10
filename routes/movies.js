const router = require('express').Router();
const validator = require('validator');

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
    image: Joi.string().required().custom((v, helper) => {
      if (validator.isURL(v)){
        return v
      }
      return helper.message('Field \'image\' has incorrect link format!');
    }),
    trailer: Joi.string().required().custom((v, helper) => {
      if (validator.isURL(v)){
        return v
      }
      return helper.message('Field \'trailer\' has incorrect link format!');
    }),
    thumbnail: Joi.string().required().custom((v, helper) => {
      if (validator.isURL(v)){
        return v
      }
      return helper.message('Field \'thumbnail\' has incorrect link format!');
    }),
    movieId: Joi.number().required(),
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
