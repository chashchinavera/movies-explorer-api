const router = require('express').Router();

const { validateMovie } = require('../middlewares/validate');

const {
  getMovies,
  createMovie,
  deleteMovie,
  // likeMovie,
  // dislikeMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.delete('/:movieId', deleteMovie);

router.post('/', validateMovie, createMovie);

// router.put('/:movieId/likes', validateMovieId, likeMovie);

// router.delete('/:movieId/likes', validateMovieId, dislikeMovie);

module.exports = router;
