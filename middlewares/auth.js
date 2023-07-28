const { checkToken } = require('../utils/jwtAuth');
const UnauthorizedStatusError = require('../utils/errors/UnauthorizedStatusError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedStatusError('Пользователь не авторизован'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = checkToken(token);

    req.user = {
      _id: payload._id,
    };
    next();
  } catch (err) {
    next(new UnauthorizedStatusError('Пользователь не авторизован'));
  }
};

module.exports = auth;
