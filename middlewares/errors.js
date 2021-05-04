function handleError(err, req, res) {
  if (err.name === 'BadRequestError') {
    res.status(400).send({ message: err.message ? err.message : 'Bad request' });
  } else if (err.name === 'ValidationError') {
    res.status(400).send({ message: err.message ? err.message : 'Bad request' });
  } else if (err.name === 'SyntaxError') {
    res.status(400).send({ message: 'Bad request' });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'Bad request' });
  } else if (err.code === 11000 && err.name === 'MongoError') {
    res.status(409).send({ message: 'Entity already exist!' });
  } else if (err.status === 401) {
    res.status(401).send({ message: 'Unauthorized' });
  } else if (err.status === 403) {
    res.status(403).send({ message: err.message ? err.message : 'ForbiddenError' });
  } else if (err.name === 'NotFoundError') {
    res.status(404).send({ message: err.message ? err.message : 'Not found error' });
  } else if (err.message.startsWith('celebrate')) {
    res.status(400).send({ message: err.details.get('params') ? err.details.get('params').message : err.details.get('body').message });
  } else {
    res.status(500).send({ message: 'Internal server error' });
  }
}

module.exports = {
  handleError,
};
