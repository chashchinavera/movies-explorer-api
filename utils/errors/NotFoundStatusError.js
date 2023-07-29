const { NOT_FOUND } = require('../constants');

class NotFoundStatusError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFoundStatusError;
