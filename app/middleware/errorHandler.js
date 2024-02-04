const { logEvents } = require("./logEvents");

const errorHandler = function (err, req, res, next) {
  console.log("AQUI");
  logEvents(`${err.name}: ${err.message}`, "errLoger.txt");
  // console.error(err.stack);
  res.status(500).send(err.message);
};
module.exports = { errorHandler };
