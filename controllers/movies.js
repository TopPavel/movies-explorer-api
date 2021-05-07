const createError = require('http-errors');
const Movie = require('../models/movies');
const { mapError } = require('../middlewares/mapError');

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw createError(404, { message: `Movie with id = ${req.params.movieId} not found!` });
    })
    .then((data) => {
      if (data.owner.toString() !== req.user._id) {
        throw createError(403, { message: 'Error! Only the owner can remove the movie' });
      }
      return Movie.remove(data)
        .then((resp) => res.send({ resp }));
    }).catch((err) => next(mapError(err)));
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((data) => res.send({ data }))
    .catch((err) => next(mapError(err)));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    owner: req.user._id,
    ...{
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    },
  })
    .then((data) => res.send({ data }))
    .catch((err) => next(mapError(err)));
};
