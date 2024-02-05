const express = require("express");
const router = express.Router();
const registrationController = require("../../controller/registerController");

router.post("/", registrationController.handleUserRegistration);

module.exports = router;
