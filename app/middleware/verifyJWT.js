const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  jwt.veriify(
    token,
    process.env.REFRESH_TOKEN_SECRET,
    (err,
    (decode) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decode.UserInfo.username;
      req.role = decode.UserInfo.role;
      next();
    })
  );
};
module.exports = verifyJWT;
