const { ValidationError, CastError } = require('mongoose').Error;
const movieModel = require('../models/movie');
const BadRequestStatusError = require('../utils/errors/BadRequestStatusError');
const NotFoundStatusError = require('../utils/errors/NotFoundStatusError');
const ForbiddenStatusError = require('../utils/errors/ForbiddenStatusError');
const {
  OK_STATUS,
  CREATED,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  movieModel.find({ owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(CREATED).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestStatusError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  movieModel.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundStatusError('Запрашиваемый фильм не найден');
      } else if (req.user._id === movie.owner.toString()) {
        return movieModel.findByIdAndRemove(req.params.movieId)
          .then(() => res.status(OK_STATUS).send({ message: 'Фильм удален' }));
      } else {
        return next(new ForbiddenStatusError('Вы не можете удалить не ваши фильмы'));
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestStatusError('По указанному id фильм не найден'));
      } else next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
