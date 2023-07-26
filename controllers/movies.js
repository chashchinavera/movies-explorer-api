const { ValidationError, CastError } = require('mongoose').Error;
const movieModel = require('../models/movie');
const BadRequestStatusError = require('../errors/BadRequestStatusError');
const NotFoundStatusError = require('../errors/NotFoundStatusError');
const ForbiddenStatusError = require('../errors/ForbiddenStatusError');
const {
  OK_STATUS,
  CREATED,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  movieModel.find({})
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  movieModel.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestStatusError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  movieModel.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundStatusError('Запрашиваемая карточка не найдена');
      } else if (req.user._id === card.owner.toString()) {
        return movieModel.findByIdAndRemove(req.params.cardId)
          .then(() => res.status(OK_STATUS).send({ message: 'Карточка удалена' }));
      } else {
        return next(new ForbiddenStatusError('Вы не можете удалить не ваши карточки'));
      }
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestStatusError('По указанному id карточка не найдена'));
      } else next(err);
    });
};

const likeCard = (req, res, next) => {
  movieModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundStatusError('Запрашиваемая карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestStatusError('По указанному id карточка не найдена'));
      } else next(err);
    });
};

const dislikeCard = (req, res, next) => {
  movieModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundStatusError('Запрашиваемая карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestStatusError('По указанному id карточка не найдена'));
      } else next(err);
    });
};

module.exports = {
  getMovies,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
