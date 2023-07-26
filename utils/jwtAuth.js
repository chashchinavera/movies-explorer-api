const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = process.env;

const checkToken = (token) => jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'key');

const signToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? SECRET_KEY : 'key', { expiresIn: '7d' });

module.exports = {
  checkToken,
  signToken,
};
