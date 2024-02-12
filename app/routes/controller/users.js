const express = require("express");
router = express.Router();
const usersRequest = require("../../controller/usersController");

router.get("/users", usersRequest.usersRequest);
