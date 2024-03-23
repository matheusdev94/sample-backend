const Users = require("../model/User");
const jwt = require("jsonwebtoken");
const UserGoogleOauth = require("../model/UserGoogleOauth");

const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies.jwt;

    const foundUser =
      (await Users.findOne({ refreshToken: refreshToken })) ||
      (await UserGoogleOauth.findOne({ refreshToken: refreshToken }));

    if (foundUser) {
      jwt.verify(
        foundUser.refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err || foundUser.username !== decoded.username) {
            return res.status(401).json({ message: "Unauthorized" });
          }
          const roles = Object.values(foundUser.roles);
          const accessToken = jwt.sign(
            {
              UserInfo: {
                username: decoded.username,
                roles: decoded.roles,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
          );

          return res.status(200).json({
            roles: roles,
            accessToken: accessToken,
            username: foundUser.username,
          });
        }
      );
    } else {
      return res.status(401).json({ err: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
};

module.exports = { handleRefreshToken };
