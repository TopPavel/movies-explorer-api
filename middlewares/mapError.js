const createError = require('http-errors');

function mapError(err) {
  if (err.name === 'BadRequestError') {
    return createError(400, { message: err.message ? err.message : 'Bad request' });
  } if (err.name === 'ValidationError') {
    return createError(400, { message: err.message ? err.message : 'Bad request' });
  } if (err.name === 'SyntaxError') {
    return createError(400, { message: 'Bad request' });
  } if (err.name === 'CastError') {
    return createError(400, { message: 'Bad request' });
  } if ((err.code === 11000 && err.name === 'MongoError') || err.status === 409) {
    return createError(409, { message: 'Entity already exist!' });
  } if (err.status === 401) {
    return createError(401, { message: err.message });
  } if (err.status === 403) {
    return createError(403, { message: err.message ? err.message : 'ForbiddenError' });
  } if (err.name === 'NotFoundError') {
    return createError(404, { message: err.message ? err.message : 'Not found error' });
  } if (err.message.startsWith('celebrate')) {
    return createError(400, { message: err.details.get('params') ? err.details.get('params').message : err.details.get('body').message });
  }
  return createError(500);
}

module.exports = {
  mapError,
};
