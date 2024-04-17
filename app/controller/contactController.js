const Contact = require("../model/Contact");
const jwt = require("jsonwebtoken");
const sendResponseWithTimer = require("../utils/responseHandler");

const REGEX = /^[A-z][A-z0-9-_]{3,300}$/;

const contactList = async (req, res) => {
  console.log("HIT contactList");
  try {
    const contacts = await Contact.find();
    let decodedContact = [];
    for (let contact of contacts) {
      jwt.verify(
        contact.UserInfo,
        process.env.DB_TOKEN_SECRET,
        (err, decoded) => {
          if (err) {
            console.error("ERR on decode data base: ", err);
          } else {
            console.log("UI: ", decoded.UserInfo);
            decodedContact.push(decoded.UserInfo);
          }
        }
      );
    }
    res.status(200).json({ contacts: decodedContact });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const contactRegistration = async (req, res) => {
  console.log("HIT contactRegistration");
  const beginTime = new Date().getTime();

  let response = null;
  let statusCode = null;
  try {
    const { username, email, phone, message } = req.body;

    console.log(message);
    console.log(REGEX.test(phone));
    console.log(REGEX.test(message));
    if (
      !REGEX.test(username) ||
      username.length > 100 ||
      typeof username !== "string"
    ) {
      statusCode = 403;
      response = "forbidden";
    }
    if (!REGEX.test(email) || email.length > 100 || typeof email !== "string") {
      statusCode = 403;
      response = "forbidden";
    }
    if (!REGEX.test(phone) || phone.length > 100 || typeof phone !== "string") {
      statusCode = 403;
      response = "forbidden";
    }
    if (
      !REGEX.test(message) ||
      message.length > 300 ||
      typeof message !== "string"
    ) {
      statusCode = 403;
      response = "forbidden";
    }
    const timeNow = new Date();
    timeNow.setHours(timeNow.getHours() - 3);

    const contact = jwt.sign(
      {
        UserInfo: {
          username: username,
          email: email,
          phone: phone,
          message: message,
          time: timeNow,
        },
      },
      process.env.DB_TOKEN_SECRET
    );
    const newContact = new Contact({
      UserInfo: contact,
    });

    const savedContact = await newContact.save();

    if (savedContact) {
      statusCode = 201;
      response = { message: "ok" };
    } else {
      statusCode = 500;
      response = { error: "Unexpected error occur." };
    }

    const finishTime = new Date().getTime();
    const responseFeedback = await sendResponseWithTimer(
      res,
      response,
      statusCode,
      finishTime - beginTime
    );
    return responseFeedback;
  } catch (e) {
    console.log(`ERRO ON REGISTER USER CONTACT.\nERRO: ${e}`);
  }
};

module.exports = {
  contactRegistration,
  contactList,
};
