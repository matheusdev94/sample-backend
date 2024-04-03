const { format } = require("date-fns");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const { v4: uuid } = require("uuid");

const logEvents = async (message, file) => {
  const dateTime = `${format(
    new Date(),
    format(new Date(), "yyyy-MM-dd|HH:mm:ss")
  )}`;
  const logItem = `${dateTime}|${uuid()}|${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", file),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};
const logger = (req, res, next) => {
  const dateTime = `${format(new Date(), format(new Date(), "yyyy-MM-dd"))}`;
  logEvents(
    `${req.method}|${req.headers.origin}|${req.url}|${req.ip}`,
    `${dateTime}-eventLog.txt`
  );
  console.log(`${req.method} ${req.path}`);
  next();
};
module.exports = { logger, logEvents };
