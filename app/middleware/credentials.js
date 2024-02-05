const allowedCredentials = require("../config/allowedList");

const credentials = (req, res, next) => {
  const origins = req.headers.origin;
  if (allowedCredentials.includes(origins)) {
    res.headers("Access-Control-Allow-Credentials", true);
  }
  next();
};
module.exports = credentials;
