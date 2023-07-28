const router = require('express').Router();
const notFoundPage = require('../utils/notFoundPage');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserLogin, validateUserBody } = require('../middlewares/validate');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', validateUserLogin, login);
router.post('/signup', validateUserBody, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', notFoundPage);

module.exports = router;