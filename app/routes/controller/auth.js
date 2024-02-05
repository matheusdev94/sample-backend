const express = require("express");
const router = express.Router();
const authController = require("../../controller/authController");

router.post("/", authController.handleAuthentication);

module.exports = router;
