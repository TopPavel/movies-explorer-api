const createError = require('http-errors');

module.exports = (err, req, res, next) => (err.message !== null && err.message.startsWith('celebrate')
  ? next(createError(400, { message: err.details.get('params') ? err.details.get('params').message : err.details.get('body').message }))
  : next(err));
