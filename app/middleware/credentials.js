const allowedCredentials = require("../config/allowedList");

const credentials = (req, res, next) => {
  console.log(
    "incio_______________________________________________________________"
  );
  console.log("On credentials middleware");
  const origins = req.headers.origin;
  console.log(`this is origins: ${origins}`);
  if (allowedCredentials.includes(origins)) {
    res.setHeader("Access-Control-Allow-Origin", origins);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  console.log(
    "fim_______________________________________________________________"
  );
  next();
};

module.exports = credentials;
