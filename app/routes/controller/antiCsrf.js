const express = require("express");
const router = express.Router();
const antiCsrfController = require("../../controller/antiCsrfController.js");

router.get("/", antiCsrfController.createAntiCsrf);
module.exports = router;
