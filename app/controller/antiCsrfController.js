const crypto = require("crypto");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const createAntiCsrf = async (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken || refreshToken.length > 250) {
    return res.status(403);
  }
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(403);
  }
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const token = jwt.sign(
    {
      refreshToken: user.refreshToken,
      csrfToken: csrfToken,
    },
    process.env.ANTI_CSRF_SECRET
  );
  return res.status(200).json({ formToken: token });
};
module.exports = { createAntiCsrf };
