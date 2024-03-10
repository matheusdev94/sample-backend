const sendResponseWithTimer = (res, response, statusCode, enlapsedTime) => {
  const timeout = 2000 - enlapsedTime;
  setTimeout(() => {
    res.status(statusCode).json(response);
  }, timeout);
};
module.exports = sendResponseWithTimer;
