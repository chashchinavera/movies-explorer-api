const router = require('express').Router();

const { validateUserId, validateUserInfo } = require('../middlewares/validate');

const {
  getUsers,
  getUserById,
  getUser,
  updateProfile,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUserInfo, updateProfile);

module.exports = router;
