const bcrypt = require('bcryptjs');
const { ValidationError } = require('mongoose').Error;
const userModel = require('../models/user');
const { signToken } = require('../utils/jwtAuth');
const ConflictStatusError = require('../utils/errors/ConflictStatusError');
const BadRequestStatusError = require('../utils/errors/BadRequestStatusError');
const UnauthorizedStatusError = require('../utils/errors/UnauthorizedStatusError');
const sendUser = require('../utils/sendUser');
const { CREATED, OK_STATUS } = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)

    .then((hash) => {
      userModel.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          res.status(CREATED).send(user);
        })
        .catch((err) => {
          if (err instanceof ValidationError) {
            next(new BadRequestStatusError('Переданы некорректные данные'));
          } else if (err.code === 11000) {
            next(new ConflictStatusError('Такой пользователь уже существует'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => sendUser(res, user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestStatusError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictStatusError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedStatusError('Неверный логин или пароль'));
      } return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isEqual]) => {
      if (!isEqual) {
        next(new UnauthorizedStatusError('Неверный логин или пароль'));
        return;
      }

      const token = signToken({ _id: user._id });

      res.status(OK_STATUS).send({ jwt: token });
    })

    .catch(next);
};

const getUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  updateProfile,
  login,
};
