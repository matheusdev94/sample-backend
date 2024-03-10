const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../model/User");

const generateToken = (data, expirationTime, secretKey) => {
  const token = jwt.sign(data, secretKey, { expiresIn: expirationTime });
  return token;
};

const sendResponseWithTimer = require("../utils/response");

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const handleAuthentication = async (req, res) => {
  console.log(
    "inicio_______________________________________________________________"
  );
  console.log("ON handleAuthentication:");
  const beginTime = new Date().getTime();
  let response = null;
  let statusCode = null;

  try {
    const { username, password } = req.body;
    console.log("username: ", username, " password: ", password);
    if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
      console.log("nao passou no regex test");
      statusCode = 401;
      response = { error: "Unauthorized" };
    } else {
      const user = await Users.findOne({ username });
      console.log("buscou user e encontrou: ", username);
      if (!user) {
        console.log("!user => sending 401");
        statusCode = 401;
        response = { error: "Unauthorized" };
      } else {
        const roles = Object.values(user.roles).filter(Boolean);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          statusCode = 401;
          response = { error: "Unauthorized" };
        } else {
          console.log("gerando aT");
          const accessToken = generateToken(
            {
              UserInfo: {
                username: username,
                roles: roles,
              },
            },
            "60s",
            process.env.ACCESS_TOKEN_SECRET
          );
          console.log("gerando rT");
          const refreshToken = generateToken(
            { username: username, roles: roles },
            "1d",
            process.env.REFRESH_TOKEN_SECRET
          );
          user.refreshToken = refreshToken;
          console.log(
            "atribuindo ao user novo rt. user agora con valor> ",
            user
          );
          console.log("update de rt do user no db");
          await Users.updateOne(
            { _id: user._id },
            { refreshToken: refreshToken }
          ).then((result) => {
            if (result.acknowledged) {
              console.log("update ok. preparando o cookie jwt");

              res.cookie("jwt", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
              });

              response = { roles, accessToken };
              statusCode = 200;
              console.log("todo finalizado com status 200.");
            } else {
              console.log();
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
  sendResponseWithTimer(res, response, statusCode, finishTime - beginTime);
  console.log(
    "fim_______________________________________________________________"
  );
};

module.exports = {
  handleAuthentication,
};
