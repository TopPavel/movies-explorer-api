const createError = require('http-errors');
const Movie = require('../models/movies');
const { handleError } = require('../middlewares/errors');

module.exports.deleteMovieById = (req, res) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw createError(404, { message: `Movie with id = ${req.params.movieId} not found!` });
    })
    .then((data) => {
      if (data.owner.toString() !== req.user._id) {
        throw createError(403, { message: 'Error! Only the owner can remove the movie' });
      }
      Movie.findByIdAndRemove(data._id.toString())
        .then((movie) => res.send({ movie }));
    }).catch((err) => handleError(err, req, res));
};

module.exports.getMovies = (req, res) => {
  Movie.find({})
    .then((data) => res.send({ data }))
    .catch((err) => handleError(err, req, res));
};

module.exports.createMovie = (req, res) => {
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
    .catch((err) => handleError(err, req, res));
};
