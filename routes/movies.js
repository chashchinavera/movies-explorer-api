const router = require('express').Router();

const { validateMovie } = require('../middlewares/validate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.delete('/:movieId', deleteMovie);

router.post('/', validateMovie, createMovie);

module.exports = router;
