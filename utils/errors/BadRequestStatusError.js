const { BAD_REQUEST } = require('../constants');

class BadRequestStatusError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequestStatusError;
