const router = require('express').Router();

const { validateUserInfo } = require('../middlewares/validate');

const {
  getUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getUser);

router.patch('/me', validateUserInfo, updateProfile);

module.exports = router;
