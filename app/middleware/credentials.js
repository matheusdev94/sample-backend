const allowedCredentials = require("../config/allowedList");

const credentials = (req, res, next) => {
  const origins = req.headers.origin;

  if (allowedCredentials.includes(origins)) {
    res.setHeader("Access-Control-Allow-Origin", origins);

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    return res.sendStatus(403);
  }
  next();
};

module.exports = credentials;
