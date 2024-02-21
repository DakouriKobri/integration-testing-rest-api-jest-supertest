function errorHandler(err, req, res, next) {
  let status = err.status || 500;

  console.log('status:', status);
  console.log('err.message:', err.message);

  return res.status(status).json({
    error: {
      status,
      message: err.message,
    },
  });
}

module.exports = errorHandler;
