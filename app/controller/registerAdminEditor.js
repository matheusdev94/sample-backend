const User = require("../model/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

const sendResponseWithTimer = require("../utils/response");

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const API_KEY = process.env.API_KEY;

const handleAdminEditorRegistration = async (req, res) => {
  console.log("AQUIiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  const beginTime = new Date().getTime();
  let responseMessage = null;
  let statusCode = null;

  try {
    const { username, password, roles, apiKey } = req.body;

    const isApiKeyValid = apiKey === API_KEY;

    if (!isApiKeyValid) {
      statusCode = 403;
      responseMessage = { error: "Invalid Credentials1" };
    } else {
      if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
        statusCode = 403;
        responseMessage = { error: "Invalid Credentials2" };
      } else {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
          statusCode = 403;
          responseMessage = { error: "Invalid Credentials3" };
        } else {
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          const newUser = new User({
            username: username,
            password: hashedPassword,
            roles: roles,
          });
          const savedUser = await newUser.save();
          if (savedUser) {
            statusCode = 201;
            responseMessage = { message: "ok" };
          } else {
            statusCode = 500;
            responseMessage = { error: "Unexpected error occur." };
          }
        }
      }
    }
  } catch (error) {
    statusCode = 500;
    responseMessage = { error: "Unexpected error occur." };
    console.error("erro on the registerContoller", error.message);
  }
  const finishTime = new Date().getTime();
  console.log(responseMessage);
  sendResponseWithTimer(
    res,
    responseMessage,
    statusCode,
    finishTime - beginTime
  );
};

module.exports = { handleAdminEditorRegistration };
