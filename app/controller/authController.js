const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../model/User");
const sendResponseWithTimer = require("../utils/responseHandler");

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const handleAuthentication = async (req, res) => {
  const beginTime = new Date().getTime();
  let response = null;
  let statusCode = null;
  try {
    const { username, password } = req.body;

    if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
      statusCode = 401;
      response = { error: "Unauthorized" };
    } else {
      const user = await Users.findOne({ username });
      if (!user) {
        statusCode = 401;
        response = { error: "Unauthorized" };
      } else {
        const roles = Object.values(user.roles).filter(Boolean);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          statusCode = 401;
          response = { error: "Unauthorized" };
        } else {
          const accessToken = jwt.sign(
            {
              UserInfo: {
                username: username,
                roles: roles,
              },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "60s" }
          );

          const refreshToken = jwt.sign(
            { username: username, roles: roles },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
          );

          user.refreshToken = refreshToken;
          await Users.updateOne(
            { _id: user._id },
            { refreshToken: refreshToken }
          ).then((result) => {
            if (result.acknowledged) {
              res.cookie("jwt", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
              });
              response = { roles, accessToken };
              statusCode = 200;
            } else {
              response = { error: "unexpected error occur" };
              statusCode = 500;
            }
          });
        }
      }
    }
  } catch (error) {
    statusCode = 500;
    response = { error: error.message };
  }

  const finishTime = new Date().getTime();
  const sendFeedBack = await sendResponseWithTimer(
    res,
    response,
    statusCode,
    finishTime - beginTime
  );
  return { statusCode, response, sendFeedBack };
};

module.exports = {
  handleAuthentication,
};
