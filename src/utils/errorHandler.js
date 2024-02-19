function errorHandler(err, req, res, next) {
  let status = err.status || 500;

  return res.status(status).json({
    error: {
      status,
      message: err.message,
    },
  });
}

module.exports = errorHandler;
