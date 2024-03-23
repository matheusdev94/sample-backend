const { format } = require("date-fns");
const { logEvents } = require("./logEvents");
const errorHandler = function (err, req, res, next) {
  const dateTime = `${format(new Date(), format(new Date(), "yyyy-MM-dd"))}`;
  logEvents(
    `${err.name}: ${err.message} ${req.url}`,
    `${dateTime}-errLoger.txt`
  );
  // console.error(err.stack);
  res.status(500).send(err.message);
};
module.exports = { errorHandler };
