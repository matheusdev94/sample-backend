const jwt = require("jsonwebtoken");
const verifyJWT = (req, res, next) => {
  console.log("incio__________________________________");
  console.log("On verifyToken");

  const authHeader = req.headers.authorization || req.headers.Authorization;

  console.log("authHeader está com valor : ", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    console.log("SEM JWT NO HEADER, Retornando status 401");
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  console.log("token: ", token);
  console.log(
    "process.env.ACCESS_TOKEN_SECRET: ",
    process.env.ACCESS_TOKEN_SECRET
  );
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(401);
    }
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    console.log("fim____________________");
    next();
  });
};
module.exports = verifyJWT;
