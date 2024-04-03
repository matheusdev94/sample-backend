const express = require("express");
router = express.Router();
const usersRequest = require("../../controller/usersController");

router.get("/", usersRequest.usersRequest);
module.exports = router;
