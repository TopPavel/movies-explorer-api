module.exports = (err, req, res, next) => {
  res.status(err.status ? err.status : 500).send({ message: err.status === 500 ? 'internal server error' : err.message });
  next();
};
