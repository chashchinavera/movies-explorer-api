const router = require('express').Router();

const { validateMovie, validateMovieId } = require('../middlewares/validate');

const {
  getMovies,
  createMovie,
  deleteMovie,
  likeMovie,
  dislikeMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.delete('/:movieId', validateMovieId, deleteMovie);

router.post('/', validateMovie, createMovie);

router.put('/:movieId/likes', validateMovieId, likeMovie);

router.delete('/:movieId/likes', validateMovieId, dislikeMovie);

module.exports = router;
