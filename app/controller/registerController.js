const bcrypt = require("bcrypt");
const User = require("../model/User");

// const sendResponseWithTimer = require("../utils/response");
const sendResponseWithTimer = require("../utils/responseHandler");

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const handleUserRegistration = async (req, res) => {
  const beginTime = new Date().getTime();
  let response = null;
  let statusCode = null;

  try {
    const { username, password } = req.body;

    if (!USER_REGEX.test(username) || !PWD_REGEX.test(password)) {
      statusCode = 401;
      response = { error: "Invalid Credentials" };
    } else {
      const existingUser = await User.findOne({ username });

      if (existingUser) {
        statusCode = 401;
        response = { error: "Invalid Credentials" };
      } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
          username: username,
          password: hashedPassword,
        });

        const savedUser = await newUser.save();
        if (savedUser) {
          statusCode = 201;
          response = { message: "ok" };
        } else {
          statusCode = 500;
          response = { error: "Unexpected error occur." };
        }
      }
    }
  } catch (error) {
    statusCode = 500;
    response = { error: "Unexpected error occur." };
    // console.error("erro on registerContoller. Error:", error.message);
  }
  const finishTime = new Date().getTime();

  // const timeout = finishTime - beginTime;
  // if (timeout > 0) {
  //   await new Promise((resolve) => setTimeout(resolve, timeout));
  // }
  // res.status(statusCode);
  // res.json(response);
  // return res;

  const responseFeedback = await sendResponseWithTimer(
    res,
    response,
    statusCode,
    finishTime - beginTime
  );
  return responseFeedback;
};

module.exports = {
  handleUserRegistration,
};
