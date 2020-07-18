const success = (res, statusCode = 200, data, message = 'success') => {
  return res.status(statusCode).json({
    message,
    data,
  });
};

module.exports = { success };
