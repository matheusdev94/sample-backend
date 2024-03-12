const sendResponseWithTimer = async (
  res,
  response,
  statusCode,
  enlapsedTime
) => {
  const timeout = 1000 - enlapsedTime;
  if (timeout > 0) {
    await new Promise((resolve) => setTimeout(resolve, timeout));
  }
  res.status(statusCode);
  res.json(response);
  return res;
};

module.exports = sendResponseWithTimer;
