const allowedCredentials = require("../config/allowedList");

const credentials = (req, res, next) => {
  // console.log("hit credentials");
  // console.log("req.headers ", req.headers);
  // console.log("req.headers.origin ", req.headers.origin);
  // console.log("req.headers.host ", req.headers.host);

  const origins = req.headers.origin || req.headers.host;
  // console.log("origins", origins);

  if (allowedCredentials.includes(origins)) {
    res.setHeader("Access-Control-Allow-Origin", origins);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS"
      // "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    return res.sendStatus(403);
  }
  next();
};

module.exports = credentials;
