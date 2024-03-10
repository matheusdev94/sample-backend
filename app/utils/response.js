const sendResponseWithTimer = (res, response, statusCode, enlapsedTime) => {
  const timeout = 3400 - enlapsedTime;
  if (timeout > 0) {
    setTimeout(() => {
      res.status(statusCode).json(response);
    }, timeout);
  } else {
    res.status(statusCode).json(response);
  }
};
module.exports = sendResponseWithTimer;
