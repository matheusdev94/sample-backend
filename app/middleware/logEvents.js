const { format } = require("date-fns");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const { v4: uuid } = require("uuid");

const logEvents = async (message, file) => {
  const dateTime = `${format(
    new Date(),
    format(new Date(), "yyyy-MM-dd\tHH:mm:ss")
  )}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  console.log(logItem);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", file),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "eventLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};
module.exports = { logger, logEvents };