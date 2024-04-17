const jwt = require("jsonwebtoken");

const csrfVerify = (req, res, next) => {
  if (req.originalUrl === " /registerContact") {
    const anticsrf = req.headers.anticsrf;
    // const refreshToken = req.cookies.jwt;
    console.log("HIT MID CSRF");
    if (!anticsrf) {
      console.log("NO anticsrf token");
      return res.status(403);
    }

    console.log("hit csrf verify| anticsrf: ", anticsrf);

    jwt.verify(anticsrf, process.env.ANTI_CSRF_SECRET, (err) => {
      if (err) {
        console.log("erro in anticsrf", err);
        return res.status(403);
      } else {
        console.log("anticsrf ok");
        next();
      }
    });
  } else {
    next();
  }
};

module.exports = csrfVerify;
